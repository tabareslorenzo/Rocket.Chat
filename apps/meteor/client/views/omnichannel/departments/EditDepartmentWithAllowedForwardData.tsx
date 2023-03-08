import { Box } from '@rocket.chat/fuselage';
import { useTranslation } from '@rocket.chat/ui-contexts';
import React, { useMemo } from 'react';

import { FormSkeleton } from '../../../components/Skeleton';
import { AsyncStatePhase } from '../../../hooks/useAsyncState';
import { useEndpointData } from '../../../hooks/useEndpointData';
import EditDepartment from './EditDepartment';
import type { EditDepartmentProps } from './EditDepartment';

function EditDepartmentWithAllowedForwardData({ data, ...props }: Omit<EditDepartmentProps, 'allowedToForwardData'>) {
	const t = useTranslation();

	const {
		value: allowedToForwardData,
		phase: allowedToForwardState,
		error: allowedToForwardError,
	} = useEndpointData('/v1/livechat/department.listByIds', {
		params: useMemo(
			() => ({
				ids: data?.department?.departmentsAllowedToForward ?? [],
			}),
			[data],
		),
	});

	if ([allowedToForwardState].includes(AsyncStatePhase.LOADING)) {
		return <FormSkeleton />;
	}

	if (allowedToForwardError) {
		return <Box mbs='x16'>{t('Not_Available')}</Box>;
	}
	return <EditDepartment data={data} allowedToForwardData={allowedToForwardData} {...props} />;
}

export default EditDepartmentWithAllowedForwardData;
