import { Meteor } from 'meteor/meteor';

import { WebdavAccounts } from '../../../app/models/client';
import { settings } from '../../../app/settings/client';
import { MessageAction } from '../../../app/ui-utils/client';
import { getURL } from '../../../app/utils/client';
import { imperativeModal } from '../../lib/imperativeModal';
import { messageArgs } from '../../lib/utils/messageArgs';
import SaveToWebdav from '../../views/room/webdav/SaveToWebdavModal';

Meteor.startup(() => {
	MessageAction.addButton({
		id: 'webdav-upload',
		icon: 'upload',
		label: 'Save_To_Webdav',
		condition: ({ message, subscription }) => {
			if (subscription == null) {
				return false;
			}
			if (WebdavAccounts.findOne() == null) {
				return false;
			}
			if (!message.file) {
				return false;
			}

			return settings.get('Webdav_Integration_Enabled');
		},
		action(_, props) {
			const { message = messageArgs(this).msg } = props;
			const [attachment] = message.attachments || [];
			const url = getURL(attachment.title_link, { full: true });
			imperativeModal.open({
				component: SaveToWebdav,
				props: {
					data: {
						attachment,
						url,
					},
					onClose: imperativeModal.close,
				},
			});
		},
		order: 100,
		group: 'menu',
	});
});
