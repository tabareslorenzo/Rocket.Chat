import { isRoomFederated } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { hasAtLeastOnePermission, hasPermission } from '../../../app/authorization/client';
import { MessageAction } from '../../../app/ui-utils/client/lib/MessageAction';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	MessageAction.addButton({
		id: 'edit-message',
		icon: 'edit',
		label: 'Edit',
		context: ['message', 'message-mobile', 'threads', 'federated'],
		action(_, props) {
			const { message = messageArgs(this).msg, chat } = props;
			chat?.messageEditing.editMessage(message);
		},
		condition({ message, subscription, settings, room }) {
			if (subscription == null) {
				return false;
			}
			if (isRoomFederated(room)) {
				return message.u._id === Meteor.userId();
			}
			const canEditMessage = hasAtLeastOnePermission('edit-message', message.rid);
			const isEditAllowed = settings.Message_AllowEditing;
			const editOwn = message.u && message.u._id === Meteor.userId();
			if (!(canEditMessage || (isEditAllowed && editOwn))) {
				return false;
			}
			const blockEditInMinutes = settings.Message_AllowEditing_BlockEditInMinutes;
			const bypassBlockTimeLimit = hasPermission('bypass-time-limit-edit-and-delete');

			if (!bypassBlockTimeLimit && blockEditInMinutes) {
				let msgTs;
				if (message.ts != null) {
					msgTs = moment(message.ts);
				}
				let currentTsDiff;
				if (msgTs != null) {
					currentTsDiff = moment().diff(msgTs, 'minutes');
				}
				return (!!currentTsDiff || currentTsDiff === 0) && currentTsDiff < blockEditInMinutes;
			}
			return true;
		},
		order: 6,
		group: 'menu',
	});
});
