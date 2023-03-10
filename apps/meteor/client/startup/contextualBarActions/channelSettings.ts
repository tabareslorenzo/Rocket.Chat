import type { FC, LazyExoticComponent } from 'react';
import { lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

addAction('channel-settings', {
	groups: ['channel', 'group'],
	id: 'channel-settings',
	anonymous: true,
	full: true,
	title: 'Room_Info',
	icon: 'info-circled',
	template: lazy(() => import('../../views/room/contextualBar/Info')) as LazyExoticComponent<FC>,
	order: 1,
});
