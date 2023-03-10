import { usePermission } from '@rocket.chat/ui-contexts';
import { useMemo, lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

addAction('members-list', ({ room }) => {
	const hasPermission = usePermission('view-broadcast-member-list', room._id);
	return useMemo(
		() =>
			!room.broadcast || hasPermission
				? {
						groups: ['channel', 'group', 'team'],
						id: 'members-list',
						title: room.teamMain ? 'Teams_members' : 'Members',
						icon: 'members',
						template: lazy(() => import('../../views/room/MemberListRouter')),
						order: 5,
				  }
				: null,
		[hasPermission, room.broadcast, room.teamMain],
	);
});
