import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { hasAtLeastOnePermission } from '../../../app/authorization/client';
import { AutoTranslate } from '../../../app/autotranslate/client/lib/autotranslate';
import { Messages } from '../../../app/models/client';
import { settings } from '../../../app/settings/client';
import { MessageAction } from '../../../app/ui-utils/client/lib/MessageAction';
import { roomCoordinator } from '../../lib/rooms/roomCoordinator';
import { messageArgs } from '../../lib/utils/messageArgs';
import { hasTranslationLanguageInAttachments, hasTranslationLanguageInMessage } from '../../views/room/MessageList/lib/autoTranslate';

Meteor.startup(() => {
	AutoTranslate.init();

	Tracker.autorun(() => {
		if (settings.get('AutoTranslate_Enabled') && hasAtLeastOnePermission(['auto-translate'])) {
			MessageAction.addButton({
				id: 'translate',
				icon: 'language',
				label: 'Translate',
				context: ['message', 'message-mobile', 'threads'],
				action(_, props) {
					const { message = messageArgs(this).msg } = props;
					const language = AutoTranslate.getLanguage(message.rid);
					if (!hasTranslationLanguageInMessage(message, language) && !hasTranslationLanguageInAttachments(message.attachments, language)) {
						AutoTranslate.messageIdsToWait.add(message._id);
						Messages.update({ _id: message._id }, { $set: { autoTranslateFetching: true } });
						Meteor.call('autoTranslate.translateMessage', message, language);
					}
					const action = 'autoTranslateShowInverse' in message ? '$unset' : '$set';
					Messages.update({ _id: message._id }, { [action]: { autoTranslateShowInverse: true } });
				},
				condition({ message, subscription, user, room }) {
					if (!user) {
						return false;
					}
					const language = subscription?.autoTranslateLanguage || AutoTranslate.getLanguage(message.rid) || '';
					const isLivechatRoom = roomCoordinator.isLivechatRoom(room?.t);
					const isDifferentUser = message?.u && message.u._id !== user._id;
					const autoTranslateEnabled = subscription?.autoTranslate || isLivechatRoom;
					const hasLanguage =
						hasTranslationLanguageInMessage(message, language) || hasTranslationLanguageInAttachments(message.attachments, language);

					return Boolean(
						(message as { autoTranslateShowInverse?: boolean }).autoTranslateShowInverse ||
							(isDifferentUser && autoTranslateEnabled && !hasLanguage),
					);
				},
				order: 90,
			});
			MessageAction.addButton({
				id: 'view-original',
				icon: 'language',
				label: 'View_original',
				context: ['message', 'message-mobile', 'threads'],
				action(_, props) {
					const { message = messageArgs(this).msg } = props;
					const language = AutoTranslate.getLanguage(message.rid);
					if (!hasTranslationLanguageInMessage(message, language) && !hasTranslationLanguageInAttachments(message.attachments, language)) {
						AutoTranslate.messageIdsToWait.add(message._id);
						Messages.update({ _id: message._id }, { $set: { autoTranslateFetching: true } });
						Meteor.call('autoTranslate.translateMessage', message, language);
					}
					const action = 'autoTranslateShowInverse' in message ? '$unset' : '$set';
					Messages.update({ _id: message._id }, { [action]: { autoTranslateShowInverse: true } });
				},
				condition({ message, subscription, user, room }) {
					const language = subscription?.autoTranslateLanguage || AutoTranslate.getLanguage(message.rid) || '';
					const isLivechatRoom = roomCoordinator.isLivechatRoom(room?.t);
					if (!user) {
						return false;
					}
					const isDifferentUser = message?.u && message.u._id !== user._id;
					const autoTranslateEnabled = subscription?.autoTranslate || isLivechatRoom;
					const hasLanguage =
						hasTranslationLanguageInMessage(message, language) || hasTranslationLanguageInAttachments(message.attachments, language);

					return Boolean(
						!(message as { autoTranslateShowInverse?: boolean }).autoTranslateShowInverse &&
							isDifferentUser &&
							autoTranslateEnabled &&
							hasLanguage,
					);
				},
				order: 90,
			});
		} else {
			MessageAction.removeButton('toggle-language');
		}
	});
});
