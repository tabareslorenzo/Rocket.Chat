import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { isSetNotNull } from '../../app/emoji-emojione/lib/rocketchat';
import { emoji } from '../../app/emoji/client';
import { getUserPreference } from '../../app/utils/client';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (isSetNotNull(() => emoji.packages.emojione)) {
			if (getUserPreference(Meteor.userId(), 'convertAsciiEmoji')) {
				emoji.packages.emojione.ascii = getUserPreference(Meteor.userId(), 'convertAsciiEmoji');
			} else {
				emoji.packages.emojione.ascii = true;
			}
		}
	});
});
