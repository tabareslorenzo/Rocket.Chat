import type { IUser } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import type { MinimongoCollection } from '../definitions/MinimongoCollection';

Meteor.startup(() => {
	// TODO: find correct typing for meteor collection
	(Meteor.users as unknown as MinimongoCollection<IUser>)
		.find(
			{},
			{
				fields: {
					name: 1,
					username: 1,
					status: 1,
					utcOffset: 1,
					statusText: 1,
				},
			},
		)
		.observe({
			added(user: IUser) {
				Session.set(`user_${user.username}_status`, user.status);
				Session.set(`user_${user.username}_status_text`, user.statusText);
			},
			changed(user: IUser) {
				Session.set(`user_${user.username}_status`, user.status);
				if (user.statusText !== undefined) {
					Session.set(`user_${user.username}_status_text`, user.statusText);
				}
			},
			removed(user: IUser) {
				Session.set(`user_${user.username}_status`, null);
				Session.set(`user_${user.username}_status_text`, null);
			},
		});
});
