import { Meteor } from 'meteor/meteor';

import { CachedCollectionManager } from '../../../app/ui-cached-collection/client';
import { Apps } from '../apps/orchestrator';

Meteor.startup(() => {
	CachedCollectionManager.onLogin(() => {
		Apps.getAppClientManager().initialize();
		Apps.load();
	});
});
