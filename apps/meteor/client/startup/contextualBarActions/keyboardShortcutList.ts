import { lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';

addAction('keyboard-shortcut-list', {
	groups: ['channel', 'group', 'direct', 'direct_multiple', 'team'],
	id: 'keyboard-shortcut-list',
	title: 'Keyboard_Shortcuts_Title',
	icon: 'keyboard',
	template: lazy(() => import('../../views/room/contextualBar/KeyboardShortcuts')),
	order: 99,
});
