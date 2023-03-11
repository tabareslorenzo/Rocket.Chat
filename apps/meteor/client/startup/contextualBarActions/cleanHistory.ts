import { isRoomFederated } from '@rocket.chat/core-typings';
import { usePermission } from '@rocket.chat/ui-contexts';
import { useMemo, lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

const template = lazy(() => import('../../views/room/contextualBar/PruneMessages'));

addAction('clean-history', ({ room }) => {
	const hasPermission = usePermission('clean-channel-history', room._id);
	const federated = isRoomFederated(room);

	return useMemo(
		() =>
			hasPermission
				? {
						groups: ['channel', 'group', 'team', 'direct_multiple', 'direct'],
						id: 'clean-history',
						full: true,
						title: 'Prune_Messages',
						icon: 'eraser',
						...(federated && {
							'data-tooltip': 'Clean_History_unavailable_for_federation',
							'disabled': true,
						}),
						template,
						order: 250,
				  }
				: null,
		[hasPermission, federated],
	);
});
