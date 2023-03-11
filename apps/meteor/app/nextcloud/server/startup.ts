import { Meteor } from 'meteor/meteor';

import { settings } from '../../settings/server';
import { fillServerURL } from '../lib/common';

Meteor.startup(() => {
	settings.watch('Accounts_OAuth_Nextcloud_URL', () => fillServerURL());
});
