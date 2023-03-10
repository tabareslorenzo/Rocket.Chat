import $ from 'jquery';
import { Meteor } from 'meteor/meteor';

import { createEventListenerFor } from '../../app/ui/client/views/app/photoswipeContent.ts';

Meteor.startup(() => {
	$(document).on('click', '.gallery-item', createEventListenerFor('.gallery-item'));
});
