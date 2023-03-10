import { Meteor } from 'meteor/meteor';

import { updateEmojiCustom } from '../../app/emoji-custom/client/lib/emojiCustom';
import { Notifications } from '../../app/notifications/client';

Meteor.startup(() => Notifications.onLogged('updateEmojiCustom', (data: { emojiData: any }) => updateEmojiCustom(data.emojiData)));
