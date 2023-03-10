import { Meteor } from 'meteor/meteor';

import { EmojiPicker } from '../../../app/emoji/client';
import { MessageAction } from '../../../app/ui-utils/client';
import { roomCoordinator } from '../../lib/rooms/roomCoordinator';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	MessageAction.addButton({
		id: 'reaction-message',
		icon: 'add-reaction',
		label: 'Add_Reaction',
		context: ['message', 'message-mobile', 'threads', 'federated'],
		action(this: unknown, event, { message = messageArgs(this).msg }) {
			event.stopPropagation();
			EmojiPicker.open(event.currentTarget, (emoji) => Meteor.call('setReaction', `:${emoji}:`, message._id));
		},
		condition({ message, user, room, subscription }) {
			if (!user) {
				return false;
			}

			if (!room) {
				return false;
			}

			if (!subscription) {
				return false;
			}

			if (message.private) {
				return false;
			}

			if (roomCoordinator.readOnly(room._id, user) && !room.reactWhenReadOnly) {
				return false;
			}
			const isLivechatRoom = roomCoordinator.isLivechatRoom(room.t);
			if (isLivechatRoom) {
				return false;
			}

			return true;
		},
		order: -2,
		group: ['message', 'menu'],
	});
});
