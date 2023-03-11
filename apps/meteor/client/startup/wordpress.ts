import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { fillSettings } from '../../app/wordpress/lib/common';

Meteor.startup(() => {
	Tracker.autorun(() => {
		fillSettings();
	});
});
