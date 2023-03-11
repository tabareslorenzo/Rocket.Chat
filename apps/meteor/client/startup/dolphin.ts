import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { config, Dolphin } from '../../app/dolphin/lib/common';
import { settings } from '../../app/settings/client';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (settings.get('Accounts_OAuth_Dolphin_URL')) {
			config.serverURL = settings.get('Accounts_OAuth_Dolphin_URL') ?? '';
			Dolphin.configure(config);
		}
	});
});
