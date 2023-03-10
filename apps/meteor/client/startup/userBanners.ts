import type { IUser } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n';
import { Tracker } from 'meteor/tracker';

import * as banners from '../lib/banners';

Meteor.startup(() => {
	Tracker.autorun(() => {
		const user = Meteor.user() as
			| (IUser & {
					banners?: Record<
						string,
						{
							id: string;
							priority: number;
							title: string;
							text: string;
							textArguments?: string[];
							modifiers: ('large' | 'danger')[];
							link: string;
							read?: boolean;
						}
					>;
			  })
			| null;

		if (user?.banners && Object.keys(user.banners).length > 0) {
			const firstBanner = Object.values(user.banners)
				.filter((b) => b.read !== true)
				.sort((a, b) => b.priority - a.priority)[0];

			if (!firstBanner) {
				return;
			}

			banners.open({
				id: firstBanner.id,
				title: TAPi18n.__(firstBanner.title),
				text: TAPi18n.__(firstBanner.text, {
					postProcess: 'sprintf',
					sprintf: firstBanner.textArguments ?? [],
				}),
				modifiers: firstBanner.modifiers,
				action() {
					if (firstBanner.link) {
						window.open(firstBanner.link, '_system');
					}
				},
				onClose() {
					Meteor.call('banner/dismiss', {
						id: firstBanner.id,
					});
				},
			});
		}
	});
});
