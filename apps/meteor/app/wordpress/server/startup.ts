import { Meteor } from 'meteor/meteor';

import { settings } from '../../settings/server';
import { fillSettings } from '../lib/common';

Meteor.startup(() => {
	settings.watchByRegex(/(API\_Wordpress\_URL)?(Accounts\_OAuth\_Wordpress\_)?/, () => fillSettings());
});
