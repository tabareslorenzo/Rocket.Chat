import type { FC, LazyExoticComponent } from 'react';
import { lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

addAction('team-channels', {
	groups: ['team'],
	id: 'team-channels',
	anonymous: true,
	full: true,
	title: 'Team_Channels',
	icon: 'hash',
	template: lazy(() => import('../../views/teams/contextualBar/channels/index')) as LazyExoticComponent<FC>,
	order: 2,
});
