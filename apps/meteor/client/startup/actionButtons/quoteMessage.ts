import { Meteor } from 'meteor/meteor';

import { MessageAction } from '../../../app/ui-utils/client/lib/MessageAction';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	MessageAction.addButton({
		id: 'quote-message',
		icon: 'quote',
		label: 'Quote',
		context: ['message', 'message-mobile', 'threads', 'federated'],
		action(_, props) {
			const { message = messageArgs(this).msg, chat, autoTranslateOptions } = props;

			if (message && autoTranslateOptions?.autoTranslateEnabled && autoTranslateOptions.showAutoTranslate(message)) {
				message.msg =
					message.translations && autoTranslateOptions.autoTranslateLanguage
						? message.translations[autoTranslateOptions.autoTranslateLanguage]
						: message.msg;
			}

			chat?.composer?.quoteMessage(message);
		},
		condition({ subscription }) {
			if (subscription == null) {
				return false;
			}

			return true;
		},
		order: -3,
		group: ['message', 'menu'],
	});
});
