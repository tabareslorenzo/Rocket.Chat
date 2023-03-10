import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { settings } from '../../app/settings/client';

Meteor.startup(() => {
	Tracker.autorun(() => {
		Meteor.absoluteUrl.defaultOptions.secure = Boolean(settings.get('Force_SSL'));
	});
});
