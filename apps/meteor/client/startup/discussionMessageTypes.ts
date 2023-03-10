import type { IMessage } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';

import { MessageTypes } from '../../app/ui-utils/client';

Meteor.startup(() => {
	MessageTypes.registerType({
		id: 'discussion-created',
		system: false,
		message: 'discussion-created',
		data(message: IMessage) {
			return {
				message: `<svg class="rc-icon" aria-hidden="true"><use xlink:href="#icon-discussion"></use></svg> ${message.msg}`,
			};
		},
	});
});
