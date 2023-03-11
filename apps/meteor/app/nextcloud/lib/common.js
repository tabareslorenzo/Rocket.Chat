import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import { settings } from '../../settings';
import { CustomOAuth } from '../../custom-oauth';

const config = {
	serverURL: '',
	tokenPath: '/index.php/apps/oauth2/api/v1/token',
	tokenSentVia: 'header',
	authorizePath: '/index.php/apps/oauth2/authorize',
	identityPath: '/ocs/v2.php/cloud/user?format=json',
	scope: 'openid',
	addAutopublishFields: {
		forLoggedInUser: ['services.nextcloud'],
		forOtherUsers: ['services.nextcloud.name'],
	},
};

const Nextcloud = new CustomOAuth('nextcloud', config);

export const fillServerURL = _.debounce(
	Meteor.bindEnvironment(() => {
		const nextcloudURL = settings.get('Accounts_OAuth_Nextcloud_URL');
		if (!nextcloudURL) {
			if (nextcloudURL === undefined) {
				return fillServerURL();
			}
			return;
		}
		config.serverURL = nextcloudURL.trim().replace(/\/*$/, '');
		return Nextcloud.configure(config);
	}),
	Meteor.isServer ? 1000 : 100,
);
