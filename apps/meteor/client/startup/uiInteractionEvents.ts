import { Meteor } from 'meteor/meteor';

import Notifications from '../../app/notifications/client/lib/Notifications';
import { CachedCollectionManager } from '../../app/ui-cached-collection/client';
import { handlePayloadUserInteraction } from '../../app/ui-message/client/ActionManager';

Meteor.startup(() => {
	CachedCollectionManager.onLogin(() => {
		Notifications.onUser('uiInteraction', ({ type, ...data }: { type: string; triggerId: string; [x: string]: unknown }) => {
			handlePayloadUserInteraction(type, data);
		});
	});
});
