import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import { settings } from '../../settings/server';
import { config, Gitlab } from '../lib/common';

Meteor.startup(() => {
	const updateConfig = _.debounce(() => {
		config.serverURL = settings.get<string>('API_Gitlab_URL')?.trim().replace(/\/*$/, '') || config.serverURL;
		config.identityPath = settings.get('Accounts_OAuth_Gitlab_identity_path') || config.identityPath;
		config.mergeUsers = Boolean(settings.get('Accounts_OAuth_Gitlab_merge_users'));
		Gitlab.configure(config);
	}, 300);

	settings.watchMultiple(['API_Gitlab_URL', 'Accounts_OAuth_Gitlab_identity_path', 'Accounts_OAuth_Gitlab_merge_users'], updateConfig);
});
