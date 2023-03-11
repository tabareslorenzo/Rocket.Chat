import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { config, Gitlab } from '../../app/gitlab/lib/common';
import { settings } from '../../app/settings/client';

Meteor.startup(() => {
	Tracker.autorun(() => {
		let anyChange = false;
		if (settings.get<string>('API_Gitlab_URL')) {
			config.serverURL = settings.get<string>('API_Gitlab_URL')?.trim().replace(/\/*$/, '') ?? '';
			anyChange = true;
		}

		if (settings.get<string>('Accounts_OAuth_Gitlab_identity_path')) {
			config.identityPath = settings.get<string>('Accounts_OAuth_Gitlab_identity_path')?.trim() || config.identityPath;
			anyChange = true;
		}

		if (settings.get<boolean>('Accounts_OAuth_Gitlab_merge_users')) {
			config.mergeUsers = true;
			anyChange = true;
		}

		if (anyChange) {
			Gitlab.configure(config);
		}
	});
});
