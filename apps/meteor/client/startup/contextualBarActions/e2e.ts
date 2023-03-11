import { isRoomFederated } from '@rocket.chat/core-typings';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import { useSetting, usePermission, useEndpoint } from '@rocket.chat/ui-contexts';
import { useMemo, useCallback } from 'react';

import { e2e } from '../../../app/e2e/client/rocketchat.e2e';
import { useReactiveValue } from '../../hooks/useReactiveValue';
import { addAction } from '../../views/room/lib/Toolbox';

addAction('e2e', ({ room }) => {
	const e2eEnabled = useSetting('E2E_Enable');
	const e2eReady = useReactiveValue(useCallback(() => e2e.isReady(), [])) || room.encrypted;
	const canToggleE2e = usePermission('toggle-room-e2e-encryption', room._id);
	const canEditRoom = usePermission('edit-room', room._id);
	const hasPermission = (room.t === 'd' || (canEditRoom && canToggleE2e)) && e2eReady;
	const federated = isRoomFederated(room);

	const toggleE2E = useEndpoint('POST', '/v1/rooms.saveRoomSettings');

	const action = useMutableCallback(() => {
		toggleE2E({ rid: room._id, encrypted: !room.encrypted });
	});

	const enabledOnRoom = !!room.encrypted;

	return useMemo(
		() =>
			e2eEnabled && hasPermission
				? {
						groups: ['direct', 'direct_multiple', 'group', 'team'],
						id: 'e2e',
						title: enabledOnRoom ? 'E2E_disable' : 'E2E_enable',
						icon: 'key',
						order: 13,
						action,
						...(federated && {
							'data-tooltip': 'E2E_unavailable_for_federation',
							'disabled': true,
						}),
				  }
				: null,
		[action, e2eEnabled, enabledOnRoom, hasPermission, federated],
	);
});
