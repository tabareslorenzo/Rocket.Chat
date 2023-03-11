import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { settings } from '../../app/settings/client';
import { config, Tokenpass } from '../../app/tokenpass/lib/common';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (settings.get('API_Tokenpass_URL')) {
			config.serverURL = settings.get('API_Tokenpass_URL') ?? '';
			Tokenpass.configure(config);
		}
	});
});
