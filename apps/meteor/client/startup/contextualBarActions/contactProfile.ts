import { lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

addAction('contact-profile', {
	groups: ['live' /* , 'voip'*/],
	id: 'contact-profile',
	title: 'Contact_Info',
	icon: 'user',
	template: lazy(() => import('../../views/omnichannel/directory/contacts/contextualBar/ContactsContextualBar')),
	order: 1,
});
