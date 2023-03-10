import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n';
import { Tracker } from 'meteor/tracker';

import { Messages } from '../../../app/models/client';
import { settings } from '../../../app/settings/client';
import { MessageAction } from '../../../app/ui-utils/client';
import { dispatchToastMessage } from '../../lib/toast';
import { callWithErrorHandling } from '../../lib/utils/callWithErrorHandling';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (!settings.get('Threads_enabled')) {
			return MessageAction.removeButton('unfollow-message');
		}
		MessageAction.addButton({
			id: 'unfollow-message',
			icon: 'bell-off',
			label: 'Unfollow_message',
			context: ['message', 'message-mobile', 'threads', 'federated'],
			async action(_, { message }) {
				if (!message) {
					return;
				}

				await callWithErrorHandling('unfollowMessage', { mid: message._id });
				dispatchToastMessage({
					type: 'success',
					message: TAPi18n.__('You_unfollowed_this_message'),
				});
			},
			condition({ message: { _id, tmid, replies = [] }, user, context }) {
				if (tmid || context) {
					const parentMessage = Messages.findOne({ _id: tmid || _id }, { fields: { replies: 1 } });
					if (parentMessage) {
						replies = parentMessage.replies || [];
					}
				}
				return user?._id ? replies.includes(user._id) : false;
			},
			order: 2,
			group: 'menu',
		});
	});
});
