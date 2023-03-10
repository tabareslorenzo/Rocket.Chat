import type { ICustomEmojiDescriptor } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';

import { deleteEmojiCustom } from '../../app/emoji-custom/client/lib/emojiCustom';
import { Notifications } from '../../app/notifications/client';

Meteor.startup(() =>
	Notifications.onLogged('deleteEmojiCustom', (data: { emojiData: ICustomEmojiDescriptor }) => deleteEmojiCustom(data.emojiData)),
);
