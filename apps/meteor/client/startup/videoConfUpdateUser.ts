import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { VideoConfManager } from '../lib/VideoConfManager';

Meteor.startup(() => Tracker.autorun(() => VideoConfManager.updateUser()));
