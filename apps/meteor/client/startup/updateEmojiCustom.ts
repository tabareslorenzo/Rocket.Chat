import type { ICustomEmojiDescriptor } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';

import { updateEmojiCustom } from '../../app/emoji-custom/client/lib/emojiCustom';
import { Notifications } from '../../app/notifications/client';

Meteor.startup(() =>
	Notifications.onLogged('updateEmojiCustom', (data: { emojiData: ICustomEmojiDescriptor }) => updateEmojiCustom(data.emojiData)),
);
