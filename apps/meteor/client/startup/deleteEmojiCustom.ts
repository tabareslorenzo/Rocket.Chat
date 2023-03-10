import { Meteor } from 'meteor/meteor';

import { deleteEmojiCustom } from '../../app/emoji-custom/client/lib/emojiCustom';
import { Notifications } from '../../app/notifications/client';

Meteor.startup(() => Notifications.onLogged('deleteEmojiCustom', (data: { emojiData: any }) => deleteEmojiCustom(data.emojiData)));
