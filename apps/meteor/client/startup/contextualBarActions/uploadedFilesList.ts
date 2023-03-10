import { lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

addAction('uploaded-files-list', {
	groups: ['channel', 'group', 'direct', 'direct_multiple', 'live', 'team'],
	id: 'uploaded-files-list',
	title: 'Files',
	icon: 'clip',
	template: lazy(() => import('../../views/room/contextualBar/RoomFiles')),
	order: 7,
});
