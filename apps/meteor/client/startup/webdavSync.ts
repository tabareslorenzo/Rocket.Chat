import type { IWebdavAccount } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { WebdavAccounts } from '../../app/models/client';
import { Notifications } from '../../app/notifications/client';
import { settings } from '../../app/settings/client';
import { APIClient } from '../../app/utils/client';

Meteor.startup(() => {
	Tracker.autorun((c) => {
		if (!settings.get('Webdav_Integration_Enabled')) {
			return;
		}
		c.stop();
		const events = {
			changed: (account: IWebdavAccount) => WebdavAccounts.upsert({ _id: account._id }, account),
			removed: ({ _id }: IWebdavAccount) => WebdavAccounts.remove({ _id }),
		} as const;

		Tracker.afterFlush(() => {
			Tracker.autorun(async () => {
				if (!Meteor.userId()) {
					return;
				}

				const { accounts } = await APIClient.get('/v1/webdav.getMyAccounts');
				accounts.forEach((account) => WebdavAccounts.insert(account));
				Notifications.onUser('webdav', ({ type, account }: { type: keyof typeof events; account: IWebdavAccount }) =>
					events[type](account),
				);
			});
		});
	});
});
