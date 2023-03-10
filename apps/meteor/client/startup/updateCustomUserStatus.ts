import { Meteor } from 'meteor/meteor';

import { Notifications } from '../../app/notifications/client';
import { updateCustomUserStatus } from '../../app/user-status/client/lib/customUserStatus';

Meteor.startup(() =>
	Notifications.onLogged('updateCustomUserStatus', (data: { userStatusData: unknown }) => updateCustomUserStatus(data.userStatusData)),
);
