import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { emoji } from '../../emoji/server';
import { getUserPreference } from '../../utils/server';
import { isSetNotNull } from '../lib/rocketchat';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (isSetNotNull(() => emoji.packages.emojione)) {
			if (isSetNotNull(() => getUserPreference(Meteor.userId(), 'convertAsciiEmoji'))) {
				emoji.packages.emojione.ascii = getUserPreference(Meteor.userId(), 'convertAsciiEmoji');
			} else {
				emoji.packages.emojione.ascii = true;
			}
		}
	});
});
