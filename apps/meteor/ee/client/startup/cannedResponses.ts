import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { hasPermission } from '../../../app/authorization/client';
import { settings } from '../../../app/settings/client';
import { APIClient } from '../../../app/utils/client';
import { CannedResponse } from '../../app/canned-responses/client/collections/CannedResponse';
import { cannedResponsesStreamer } from '../../app/canned-responses/client/streamer';

const events = {
	changed: (response: { _id: string; shortcut: string; text: string; type?: 'changed' | 'removed' }) => {
		delete response.type;
		CannedResponse.upsert({ _id: response._id }, response);
	},
	removed: (response: { _id: string; shortcut: string; text: string; type: 'changed' | 'removed' }) =>
		CannedResponse.remove({ _id: response._id }),
} as const;

Meteor.startup(() => {
	Tracker.autorun(async (c) => {
		if (!Meteor.userId()) {
			return;
		}
		if (!settings.get('Canned_Responses_Enable')) {
			return;
		}
		if (!hasPermission('view-canned-responses')) {
			return;
		}
		try {
			cannedResponsesStreamer.on(
				'canned-responses',
				(response: { _id: string; shortcut: string; text: string; type: 'changed' | 'removed' }, options?: { agentsId?: string[] }) => {
					const { agentsId } = options || {};
					const uid = Meteor.userId();
					if (Array.isArray(agentsId) && uid && !agentsId.includes(uid)) {
						return;
					}
					events[response.type](response);
				},
			);
			const { responses } = await APIClient.get('/v1/canned-responses.get');
			responses.forEach((response) => CannedResponse.insert(response));
			c.stop();
		} catch (error) {
			console.log(error);
		}
	});
});
