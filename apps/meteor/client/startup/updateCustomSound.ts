import type { ICustomSound } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';

import { CustomSounds } from '../../app/custom-sounds/client/lib/CustomSounds';
import { Notifications } from '../../app/notifications/client';
import { CachedCollectionManager } from '../../app/ui-cached-collection/client';

Meteor.startup(() =>
	CachedCollectionManager.onLogin(() =>
		Notifications.onAll('updateCustomSound', (data: { soundData: ICustomSound }) => CustomSounds.update(data.soundData)),
	),
);
