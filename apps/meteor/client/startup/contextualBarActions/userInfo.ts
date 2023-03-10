import { lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

addAction('user-info', {
	groups: ['direct'],
	id: 'user-info',
	title: 'User_Info',
	icon: 'user',
	template: lazy(() => import('../../views/room/MemberListRouter')),
	order: 1,
});
