import { Meteor } from 'meteor/meteor';

import { settings } from '../../settings/server';
import { config, GitHubEnterprise } from '../lib/common';

Meteor.startup(() => {
	settings.watch('API_GitHub_Enterprise_URL', (value: string) => {
		config.serverURL = value;
		GitHubEnterprise.configure(config);
	});
});
