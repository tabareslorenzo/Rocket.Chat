import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { ChatSubscription } from '../../../app/models/client';
import { RoomManager, MessageAction } from '../../../app/ui-utils/client';
import { roomCoordinator } from '../../lib/rooms/roomCoordinator';
import { dispatchToastMessage } from '../../lib/toast';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	MessageAction.addButton({
		id: 'mark-message-as-unread',
		icon: 'flag',
		label: 'Mark_unread',
		context: ['message', 'message-mobile', 'threads'],
		action(this: unknown, _, { message = messageArgs(this).msg }) {
			return Meteor.call('unreadMessages', message, (error: unknown) => {
				if (error) {
					dispatchToastMessage({ type: 'error', message: error });
					return;
				}
				const subscription = ChatSubscription.findOne({
					rid: message.rid,
				});
				if (subscription == null) {
					return;
				}
				RoomManager.close(subscription.t + subscription.name);
				return FlowRouter.go('home');
			});
		},
		condition({ message, user, room }) {
			const isLivechatRoom = roomCoordinator.isLivechatRoom(room.t);
			if (isLivechatRoom) {
				return false;
			}

			if (!user) {
				return false;
			}

			return message.u._id !== user._id;
		},
		order: 10,
		group: 'menu',
	});
});
