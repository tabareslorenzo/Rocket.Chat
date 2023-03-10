import { Meteor } from 'meteor/meteor';

import { emoji } from '../../app/emoji/client';
import { CachedCollectionManager } from '../../app/ui-cached-collection/client';
import { APIClient } from '../../app/utils/client';

Meteor.startup(() => {
	CachedCollectionManager.onLogin(async () => {
		try {
			const {
				emojis: { update: emojis },
			} = await APIClient.get('/v1/emoji-custom.list');

			emoji.packages.emojiCustom.emojisByCategory = { rocket: [] };
			for (const currentEmoji of emojis) {
				emoji.packages.emojiCustom.emojisByCategory.rocket.push(currentEmoji.name);
				emoji.packages.emojiCustom.list.push(`:${currentEmoji.name}:`);
				emoji.list[`:${currentEmoji.name}:`] = currentEmoji;
				emoji.list[`:${currentEmoji.name}:`].emojiPackage = 'emojiCustom';
				for (const alias of currentEmoji.aliases) {
					emoji.packages.emojiCustom.list.push(`:${alias}:`);
					emoji.list[`:${alias}:`] = {
						emojiPackage: 'emojiCustom',
						aliasOf: currentEmoji.name,
					};
				}
			}
		} catch (e) {
			console.error('Error getting custom emoji', e);
		}
	});
});
