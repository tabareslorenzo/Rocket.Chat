import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { settings } from '../../../app/settings/client';
import { MessageAction } from '../../../app/ui-utils/client';
import { roomCoordinator } from '../../lib/rooms/roomCoordinator';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (!settings.get('Threads_enabled')) {
			return MessageAction.removeButton('reply-in-thread');
		}
		MessageAction.addButton({
			id: 'reply-in-thread',
			icon: 'thread',
			label: 'Reply_in_thread',
			context: ['message', 'message-mobile'],
			action(e, props) {
				const { message = messageArgs(this).msg } = props;
				e.stopPropagation();
				FlowRouter.setParams({
					tab: 'thread',
					context: message.tmid || message._id,
				});
			},
			condition({ subscription, room }) {
				const isLivechatRoom = roomCoordinator.isLivechatRoom(room.t);
				if (isLivechatRoom) {
					return false;
				}
				return Boolean(subscription);
			},
			order: -1,
			group: ['message', 'menu'],
		});
	});
});
