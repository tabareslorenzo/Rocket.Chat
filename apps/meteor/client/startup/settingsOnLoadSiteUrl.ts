import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { settings } from '../../app/settings/client';

Meteor.startup(() => {
	Tracker.autorun(() => {
		const value = settings.get('Site_Url');
		if (value == null || value.trim() === '') {
			return;
		}
		window.__meteor_runtime_config__.ROOT_URL = value;
	});
});
