import type { ICustomUserStatus, UserStatus } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { userStatus } from '../../app/user-status/client/lib/userStatus';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (!Meteor.userId()) {
			return;
		}

		Meteor.call('listCustomUserStatus', (_error: Error | undefined, result: ICustomUserStatus[] | undefined) => {
			if (!result) {
				return;
			}

			for (const customStatus of result) {
				const newUserStatus = {
					name: customStatus.name,
					id: customStatus._id,
					statusType: customStatus.statusType as UserStatus,
					localizeName: false,
				};

				userStatus.packages.customUserStatus.list.push(newUserStatus);
				userStatus.list[newUserStatus.id] = newUserStatus;
			}
		});
	});
});
