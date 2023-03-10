import { isRoomFederated } from '@rocket.chat/core-typings';
import { useTranslation } from '@rocket.chat/ui-contexts';
import { useMemo, lazy } from 'react';

import { useHasLicenseModule } from '../../../ee/client/hooks/useHasLicenseModule';
import { addAction } from '../../views/room/lib/Toolbox';

addAction('calls', ({ room }) => {
	const t = useTranslation();
	const hasLicense = useHasLicenseModule('videoconference-enterprise');
	const federated = isRoomFederated(room);

	return useMemo(
		() =>
			hasLicense
				? {
						groups: ['channel', 'group', 'team'],
						id: 'calls',
						icon: 'phone',
						title: 'Calls',
						...(federated && {
							'data-tooltip': t('Video_Call_unavailable_for_this_type_of_room'),
							'disabled': true,
						}),
						template: lazy(() => import('../../views/room/contextualBar/VideoConference/VideoConfList')),
						order: 999,
				  }
				: null,
		[hasLicense, federated, t],
	);
});
