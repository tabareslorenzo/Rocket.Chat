import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { config, Drupal } from '../../app/drupal/lib/common';
import { settings } from '../../app/settings/client';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (settings.get('API_Drupal_URL')) {
			config.serverURL = settings.get('API_Drupal_URL') ?? '';
			Drupal.configure(config);
		}
	});
});
