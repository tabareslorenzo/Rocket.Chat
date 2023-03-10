import type { IMessage } from '@rocket.chat/core-typings';

import { Rooms } from '../../app/models/client';
import { Notifications } from '../../app/notifications/client';
import { APIClient, t } from '../../app/utils/client';
import { actionLinks } from '../lib/actionLinks';
import { dispatchToastMessage } from '../lib/toast';

actionLinks.register('joinLivechatWebRTCCall', (message: IMessage) => {
	const room = Rooms.findOne({ _id: message.rid });
	if (!room) {
		throw new Error('Room not found');
	}
	const { callStatus, _id } = room;
	if (callStatus === 'declined' || callStatus === 'ended') {
		dispatchToastMessage({ type: 'info', message: t('Call_Already_Ended') });
		return;
	}
	window.open(`/meet/${_id}`, _id);
});

actionLinks.register('endLivechatWebRTCCall', async (message: IMessage) => {
	const room = Rooms.findOne({ _id: message.rid });
	if (!room) {
		throw new Error('Room not found');
	}
	const { callStatus, _id } = room;
	if (callStatus === 'declined' || callStatus === 'ended') {
		dispatchToastMessage({ type: 'info', message: t('Call_Already_Ended') });
		return;
	}
	await APIClient.put(`/v1/livechat/webrtc.call/${message._id}`, { rid: _id, status: 'ended' });
	Notifications.notifyRoom(_id, 'webrtc', 'callStatus', { callStatus: 'ended' });
});
