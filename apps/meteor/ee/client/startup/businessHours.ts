import { Meteor } from 'meteor/meteor';

import { businessHourManager } from '../../../app/livechat/client/views/app/business-hours/BusinessHours';
import { settings } from '../../../app/settings/client';
import { hasLicense } from '../../app/license/client';
import { EESingleBusinessHourBehaviour } from '../../app/livechat-enterprise/client/SingleBusinessHour';
import { MultipleBusinessHoursBehavior } from '../../app/livechat-enterprise/client/views/business-hours/Multiple';

const businessHours = {
	Multiple: new MultipleBusinessHoursBehavior(),
	Single: new EESingleBusinessHourBehaviour(),
} as const;

Meteor.startup(() => {
	settings.onload('Livechat_business_hour_type', async (_, value) => {
		if (await hasLicense('livechat-enterprise')) {
			businessHourManager.registerBusinessHourBehavior(businessHours[value as keyof typeof businessHours]);
		}
	});
});
