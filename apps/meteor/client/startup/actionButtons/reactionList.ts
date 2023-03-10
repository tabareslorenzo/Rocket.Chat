import { Meteor } from 'meteor/meteor';

import { MessageAction } from '../../../app/ui-utils/client/lib/MessageAction';
import { imperativeModal } from '../../lib/imperativeModal';
import { messageArgs } from '../../lib/utils/messageArgs';
import ReactionList from '../../views/room/modals/ReactionListModal';

Meteor.startup(() => {
	MessageAction.addButton({
		id: 'reaction-list',
		icon: 'emoji',
		label: 'Reactions',
		context: ['message', 'message-mobile', 'threads'],
		action(this: unknown, _, { message: { reactions = {} } = messageArgs(this).msg }) {
			imperativeModal.open({
				component: ReactionList,
				props: { reactions, onClose: imperativeModal.close },
			});
		},
		condition({ message: { reactions } }) {
			return !!reactions;
		},
		order: 18,
		group: 'menu',
	});
});
