import { lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

addAction('voip-room-info', {
	groups: ['voip'],
	id: 'voip-room-info',
	title: 'Call_Information',
	icon: 'info-circled',
	template: lazy(() => import('../../views/omnichannel/directory/calls/contextualBar/CallsContextualBarRoom')),
	order: 0,
});
