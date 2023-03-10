import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { CustomSounds } from '../../app/custom-sounds/client';
import { Subscriptions, Users } from '../../app/models/client';
import { settings } from '../../app/settings/client';
import { getUserPreference } from '../../app/utils/client';

Meteor.startup(() => {
	let audio: HTMLMediaElement | undefined;

	Tracker.autorun(() => {
		if (!settings.get('Livechat_continuous_sound_notification_new_livechat_room')) {
			audio?.pause();
			return;
		}

		const subs = Subscriptions.find({ t: 'l', ls: { $exists: false }, open: true }).count();
		if (subs === 0) {
			audio?.pause();
			return;
		}

		const uid = Meteor.userId();
		if (!uid) {
			audio?.pause();
			return;
		}

		const user = Users.findOne(uid, {
			fields: {
				'settings.preferences.newRoomNotification': 1,
			},
		});

		const newRoomNotification = getUserPreference(user, 'newRoomNotification');

		audio = CustomSounds.play(newRoomNotification, { loop: true });
	});
});
