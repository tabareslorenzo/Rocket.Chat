import type { IUser } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';

import { settings } from '../../../app/settings/client';
import { MessageAction } from '../../../app/ui-utils/client';
import { queryClient } from '../../lib/queryClient';
import { dispatchToastMessage } from '../../lib/toast';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	MessageAction.addButton({
		id: 'unstar-message',
		icon: 'star',
		label: 'Unstar_Message',
		context: ['starred', 'message', 'message-mobile', 'threads', 'federated'],
		action(_, props) {
			const { message = messageArgs(this).msg } = props;

			Meteor.call('starMessage', { ...message, starred: false }, (error?: Error) => {
				if (error) {
					dispatchToastMessage({ type: 'error', message: error });
					return;
				}

				queryClient.invalidateQueries(['rooms', message.rid, 'starred-messages']);
			});
		},
		condition({ message, subscription, user }) {
			if (subscription == null && settings.get('Message_AllowStarring')) {
				return false;
			}

			return Boolean(message.starred?.find((star: Pick<IUser, '_id'>) => star._id === user?._id));
		},
		order: 9,
		group: 'menu',
	});
});
