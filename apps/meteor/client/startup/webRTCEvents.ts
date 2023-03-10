import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Notifications } from '../../app/notifications/client';
import { WebRTC } from '../../app/webrtc/client/WebRTCClass';
import { WEB_RTC_EVENTS } from '../../app/webrtc/lib/constants';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (!Meteor.userId()) {
			return;
		}

		Notifications.onUser(WEB_RTC_EVENTS.WEB_RTC, (type: unknown, data: { room?: unknown }) => {
			if (data.room == null) {
				return;
			}
			const webrtc = WebRTC.getInstanceByRoomId(data.room);
			webrtc.onUserStream(type, data);
		});
	});
});
