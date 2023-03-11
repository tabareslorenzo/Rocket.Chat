import { settings } from '../../settings';

export const fileUploadMediaWhiteList = (customWhiteList) => {
	const mediaTypeWhiteList = customWhiteList || settings.get('FileUpload_MediaTypeWhiteList');

	if (!mediaTypeWhiteList || mediaTypeWhiteList === '*') {
		return;
	}
	return mediaTypeWhiteList.split(',').map((item) => {
		return item.trim();
	});
};

const fileUploadMediaBlackList = () => {
	const blacklist = settings.get('FileUpload_MediaTypeBlackList');
	if (!blacklist) {
		return;
	}

	return blacklist.split(',').map((item) => item.trim());
};

const isTypeOnList = (type, list) => {
	if (list.includes(type)) {
		return true;
	}
	const wildCardGlob = '/*';
	const wildcards = list.filter(function (item) {
		return item.indexOf(wildCardGlob) > 0;
	});
	if (wildcards.includes(type.replace(/(\/.*)$/, wildCardGlob))) {
		return true;
	}
};

export const fileUploadIsValidContentType = (type, customWhiteList) => {
	const blackList = fileUploadMediaBlackList();
	const whiteList = fileUploadMediaWhiteList(customWhiteList);

	if (!type && blackList) {
		return false;
	}

	if (blackList && isTypeOnList(type, blackList)) {
		return false;
	}

	if (!whiteList) {
		return true;
	}

	return isTypeOnList(type, whiteList);
};
