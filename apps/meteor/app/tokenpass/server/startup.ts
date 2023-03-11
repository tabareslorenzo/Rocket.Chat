import { Meteor } from 'meteor/meteor';

import { settings } from '../../settings/server';
import { config, Tokenpass } from '../lib/common';

Meteor.startup(() => {
	settings.watch('API_Tokenpass_URL', (value: string) => {
		config.serverURL = value;
		Tokenpass.configure(config);
	});
});
