import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { getUserPreference } from '../../../app/utils/client';
import { callbacks } from '../../../lib/callbacks';

Meteor.startup(() => {
	Tracker.autorun(() => {
		const highlights = getUserPreference<(string | undefined)[]>(Meteor.userId() ?? undefined, 'highlights');
		const isEnabled = highlights?.some((highlight) => highlight?.trim()) ?? false;

		if (!isEnabled) {
			callbacks.remove('renderMessage', 'highlight-words');
			return;
		}

		const options = {
			wordsToHighlight: highlights?.filter((highlight): highlight is string => !!highlight?.trim()) || [],
		};

		import('../../../app/highlight-words/client').then(({ createHighlightWordsMessageRenderer }) => {
			const renderMessage = createHighlightWordsMessageRenderer(options);
			callbacks.remove('renderMessage', 'highlight-words');
			callbacks.add('renderMessage', renderMessage, callbacks.priority.MEDIUM + 1, 'highlight-words');
		});
	});
});
