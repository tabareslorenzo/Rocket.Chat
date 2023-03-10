import { Meteor } from 'meteor/meteor';

import { CustomSounds } from '../../app/custom-sounds/client/lib/CustomSounds';
import { CachedCollectionManager } from '../../app/ui-cached-collection/client';

Meteor.startup(() =>
	CachedCollectionManager.onLogin(() => {
		Meteor.call('listCustomSounds', (_error: Error | null, result: any[]) => {
			for (const sound of result) {
				CustomSounds.add(sound);
			}
		});
	}),
);
