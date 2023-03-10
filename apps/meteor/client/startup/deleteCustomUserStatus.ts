import { Meteor } from 'meteor/meteor';

import { Notifications } from '../../app/notifications/client';
import { deleteCustomUserStatus } from '../../app/user-status/client/lib/customUserStatus';

Meteor.startup(() =>
	Notifications.onLogged('deleteCustomUserStatus', (data: { userStatusData: unknown }) => deleteCustomUserStatus(data.userStatusData)),
);
