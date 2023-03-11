import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

import { settings } from '../../settings/server';
import { callbacks } from '../../../lib/callbacks';
import { config, Dolphin, DolphinOnCreateUser } from '../lib/common';

Meteor.startup(() => {
	settings.watch('Accounts_OAuth_Dolphin_URL', (value: string) => {
		config.serverURL = value;
		return Dolphin.configure(config);
	});
});

if (settings.get('Accounts_OAuth_Dolphin_URL')) {
	const data = {
		buttonLabelText: settings.get<string>('Accounts_OAuth_Dolphin_button_label_text'),
		buttonColor: settings.get<string>('Accounts_OAuth_Dolphin_button_color'),
		buttonLabelColor: settings.get<string>('Accounts_OAuth_Dolphin_button_label_color'),
		clientId: settings.get<string>('Accounts_OAuth_Dolphin_id'),
		secret: settings.get<string>('Accounts_OAuth_Dolphin_secret'),
		serverURL: settings.get<string>('Accounts_OAuth_Dolphin_URL'),
		loginStyle: settings.get<string>('Accounts_OAuth_Dolphin_login_style'),
	};

	ServiceConfiguration.configurations.upsert({ service: 'dolphin' }, { $set: data });
}

callbacks.add('beforeCreateUser', DolphinOnCreateUser, callbacks.priority.HIGH, 'dolphin');
