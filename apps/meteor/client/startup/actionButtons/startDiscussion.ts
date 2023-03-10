import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { hasPermission } from '../../../app/authorization/client';
import { settings } from '../../../app/settings/client';
import { MessageAction } from '../../../app/ui-utils/client/lib/MessageAction';
import CreateDiscussion from '../../components/CreateDiscussion/CreateDiscussion';
import { imperativeModal } from '../../lib/imperativeModal';
import { roomCoordinator } from '../../lib/rooms/roomCoordinator';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (!settings.get('Discussion_enabled')) {
			return MessageAction.removeButton('start-discussion');
		}

		MessageAction.addButton({
			id: 'start-discussion',
			icon: 'discussion',
			label: 'Discussion_start',
			context: ['message', 'message-mobile'],
			async action(this: unknown, _, { message = messageArgs(this).msg, room }) {
				imperativeModal.open({
					component: CreateDiscussion,
					props: {
						defaultParentRoom: room?.prid || room?._id,
						onClose: imperativeModal.close,
						parentMessageId: message._id,
						nameSuggestion: message?.msg?.substr(0, 140),
					},
				});
			},
			condition({
				message: {
					u: { _id: uid },
					drid,
					dcount,
				},
				room,
				subscription,
				user,
			}) {
				if (drid || (!Number.isNaN(dcount) && dcount !== undefined)) {
					return false;
				}
				if (!subscription) {
					return false;
				}
				const isLivechatRoom = roomCoordinator.isLivechatRoom(room.t);
				if (isLivechatRoom) {
					return false;
				}

				if (!user) {
					return false;
				}

				return uid !== user._id ? hasPermission('start-discussion-other-user') : hasPermission('start-discussion');
			},
			order: 1,
			group: 'menu',
		});
	});
});
