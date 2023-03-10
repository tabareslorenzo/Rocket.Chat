import type { IMessage } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n';

import { MessageAction } from '../../../app/ui-utils/client/lib/MessageAction';
import { dispatchToastMessage } from '../../lib/toast';
import { messageArgs } from '../../lib/utils/messageArgs';

const getMainMessageText = (message: IMessage): IMessage => {
	const newMessage = { ...message };
	newMessage.msg = newMessage.msg || newMessage.attachments?.[0]?.description || newMessage.attachments?.[0]?.title || '';
	newMessage.md = newMessage.md || newMessage.attachments?.[0]?.descriptionMd || undefined;
	return { ...newMessage };
};

Meteor.startup(() => {
	MessageAction.addButton({
		id: 'copy',
		icon: 'copy',
		label: 'Copy',
		// classes: 'clipboard',
		context: ['message', 'message-mobile', 'threads', 'federated'],
		action(_, props) {
			const { message = messageArgs(this).msg } = props;
			const msgText = getMainMessageText(message).msg;
			navigator.clipboard.writeText(msgText);
			dispatchToastMessage({ type: 'success', message: TAPi18n.__('Copied') });
		},
		condition({ subscription }) {
			return !!subscription;
		},
		order: 5,
		group: 'menu',
	});
});
