import { Meteor } from 'meteor/meteor';

import { loadButtons } from '../../app/ui-message/client/ActionButtonSyncer';

Meteor.startup(() => loadButtons());
