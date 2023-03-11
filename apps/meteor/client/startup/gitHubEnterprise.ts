import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { config, GitHubEnterprise } from '../../app/github-enterprise/lib/common';
import { settings } from '../../app/settings/client';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (settings.get('API_GitHub_Enterprise_URL')) {
			config.serverURL = settings.get('API_GitHub_Enterprise_URL') ?? '';
			GitHubEnterprise.configure(config);
		}
	});
});
