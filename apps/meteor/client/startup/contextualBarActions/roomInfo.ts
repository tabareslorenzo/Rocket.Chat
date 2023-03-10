import { lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

addAction('room-info', {
	groups: ['live' /* , 'voip'*/],
	id: 'room-info',
	title: 'Room_Info',
	icon: 'info-circled',
	template: lazy(() => import('../../views/omnichannel/directory/chats/contextualBar/ChatsContextualBar')),
	order: 0,
});
