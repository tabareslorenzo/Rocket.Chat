import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { fillServerURL } from '../../app/nextcloud/lib/common';

Meteor.startup(() => {
	Tracker.autorun(() => {
		fillServerURL();
	});
});
