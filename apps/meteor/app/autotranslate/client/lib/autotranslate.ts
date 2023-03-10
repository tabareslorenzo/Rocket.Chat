import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import mem from 'mem';
import type {
	IRoom,
	ISubscription,
	ISupportedLanguage,
	ITranslatedMessage,
	IUser,
	MessageAttachmentDefault,
} from '@rocket.chat/core-typings';
import { isTranslatedMessageAttachment } from '@rocket.chat/core-typings';

import { Subscriptions, Messages } from '../../../models/client';
import { hasPermission } from '../../../authorization/client';
import { call } from '../../../../client/lib/utils/call';
import {
	hasTranslationLanguageInAttachments,
	hasTranslationLanguageInMessage,
} from '../../../../client/views/room/MessageList/lib/autoTranslate';

const getUserLanguage = () =>
	Tracker.nonreactive(() => {
		const user: Pick<IUser, 'language' | 'username'> | null = Meteor.user();
		return user?.language || 'en';
	});

const getUsername = () =>
	Tracker.nonreactive(() => {
		const user: Pick<IUser, 'language' | 'username'> | null = Meteor.user();
		return user?.username || '';
	});

export const AutoTranslate = {
	initialized: false,
	providersMetadata: {} as { [providerNamer: string]: { name: string; displayName: string } },
	messageIdsToWait: {} as { [messageId: string]: string },
	supportedLanguages: [] as ISupportedLanguage[] | undefined,

	findSubscriptionByRid: mem((rid) => Subscriptions.findOne({ rid })),

	getLanguage(rid: IRoom['_id']): string {
		let subscription: ISubscription | undefined;
		if (rid) {
			subscription = this.findSubscriptionByRid(rid);
		}
		const language = (subscription?.autoTranslateLanguage || getUserLanguage() || window.defaultUserLanguage?.()) as string;
		if (language.indexOf('-') !== -1) {
			if (!(this.supportedLanguages || []).some((supportedLanguage) => supportedLanguage.language === language)) {
				return language.slice(0, 2);
			}
		}
		return language;
	},

	translateAttachments(
		attachments: MessageAttachmentDefault[],
		language: string,
		autoTranslateShowInverse: boolean,
	): MessageAttachmentDefault[] {
		if (!isTranslatedMessageAttachment(attachments)) {
			return attachments;
		}
		for (const attachment of attachments) {
			if (attachment.author_name !== getUsername()) {
				if (attachment.text && attachment.translations && attachment.translations[language]) {
					attachment.translations.original = attachment.text;

					if (autoTranslateShowInverse) {
						attachment.text = attachment.translations.original;
					} else {
						attachment.text = attachment.translations[language];
					}
				}

				if (attachment.description && attachment.translations && attachment.translations[language]) {
					attachment.translations.original = attachment.description;

					if (autoTranslateShowInverse) {
						attachment.description = attachment.translations.original;
					} else {
						attachment.description = attachment.translations[language];
					}
				}

				// @ts-expect-error - not sure what to do with this
				if (attachment.attachments && attachment.attachments.length > 0) {
					// @ts-expect-error - not sure what to do with this
					attachment.attachments = this.translateAttachments(attachment.attachments, language);
				}
			}
		}
		return attachments;
	},

	init(): void {
		if (this.initialized) {
			return;
		}

		Tracker.autorun(async (c) => {
			const uid = Meteor.userId();
			if (!uid || !hasPermission('auto-translate')) {
				return;
			}

			c.stop();

			try {
				[this.providersMetadata, this.supportedLanguages] = await Promise.all([
					call('autoTranslate.getProviderUiMetadata'),
					call('autoTranslate.getSupportedLanguages', 'en'),
				]);
			} catch (e: unknown) {
				// Avoid unwanted error message on UI when autotranslate is disabled while fetching data
				console.error((e as Error).message);
			}
		});

		Subscriptions.find().observeChanges({
			changed: (_id: string, fields: ISubscription) => {
				if (fields.hasOwnProperty('autoTranslate') || fields.hasOwnProperty('autoTranslateLanguage')) {
					mem.clear(this.findSubscriptionByRid);
				}
			},
		});

		this.initialized = true;
	},
};

export const createAutoTranslateMessageRenderer = (): ((message: ITranslatedMessage) => ITranslatedMessage) => {
	AutoTranslate.init();

	return (message: ITranslatedMessage): ITranslatedMessage => {
		const subscription = AutoTranslate.findSubscriptionByRid(message.rid);
		const autoTranslateLanguage = AutoTranslate.getLanguage(message.rid);
		if (message.u && message.u._id !== Meteor.userId()) {
			if (!message.translations) {
				message.translations = {};
			}
			if (!!subscription?.autoTranslate !== !!message.autoTranslateShowInverse) {
				message.translations.original = message.html;
				if (
					message.translations[autoTranslateLanguage] &&
					!hasTranslationLanguageInAttachments(message.attachments, autoTranslateLanguage)
				) {
					message.html = message.translations[autoTranslateLanguage];
				}

				if (message.attachments && message.attachments.length > 0) {
					message.attachments = AutoTranslate.translateAttachments(
						message.attachments,
						autoTranslateLanguage,
						!!message.autoTranslateShowInverse,
					);
				}
			}
		}
		return message;
	};
};

export const createAutoTranslateMessageStreamHandler = (): ((message: ITranslatedMessage) => void) => {
	AutoTranslate.init();

	return (message: ITranslatedMessage): void => {
		if (message.u && message.u._id !== Meteor.userId()) {
			const subscription = AutoTranslate.findSubscriptionByRid(message.rid);
			const language = AutoTranslate.getLanguage(message.rid);
			if (
				subscription &&
				subscription.autoTranslate === true &&
				message.msg &&
				(!message.translations ||
					(!hasTranslationLanguageInMessage(message, language) && !hasTranslationLanguageInAttachments(message.attachments, language)))
			) {
				// || (message.attachments && !_.find(message.attachments, attachment => { return attachment.translations && attachment.translations[language]; }))
				Messages.update({ _id: message._id }, { $set: { autoTranslateFetching: true } });
			} else if (AutoTranslate.messageIdsToWait[message._id] !== undefined && subscription && subscription.autoTranslate !== true) {
				Messages.update({ _id: message._id }, { $set: { autoTranslateShowInverse: true }, $unset: { autoTranslateFetching: true } });
				delete AutoTranslate.messageIdsToWait[message._id];
			} else if (message.autoTranslateFetching === true) {
				Messages.update({ _id: message._id }, { $unset: { autoTranslateFetching: true } });
			}
		}
	};
};
