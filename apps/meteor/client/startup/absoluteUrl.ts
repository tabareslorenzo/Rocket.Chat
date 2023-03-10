import { Meteor } from 'meteor/meteor';

import { settings } from '../../app/settings/client';
import { baseURI } from '../lib/baseURI';

Meteor.absoluteUrl.defaultOptions.rootUrl = baseURI;

Meteor.startup(() => {
	Tracker.autorun(() => {
		Meteor.absoluteUrl.defaultOptions.secure = Boolean(settings.get('Force_SSL'));
	});
});
