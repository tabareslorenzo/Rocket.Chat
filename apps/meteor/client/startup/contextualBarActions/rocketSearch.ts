import { lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

addAction('rocket-search', {
	groups: ['channel', 'group', 'direct', 'direct_multiple', 'live', 'team'],
	id: 'rocket-search',
	title: 'Search_Messages',
	icon: 'magnifier',
	template: lazy(() => import('../../views/room/contextualBar/MessageSearchTab')),
	order: 6,
});
