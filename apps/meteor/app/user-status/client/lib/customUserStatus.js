import { userStatus } from './userStatus';

userStatus.packages.customUserStatus = {
	list: [],
};

export const deleteCustomUserStatus = function (customUserStatusData) {
	delete userStatus.list[customUserStatusData._id];

	const arrayIndex = userStatus.packages.customUserStatus.list.indexOf(customUserStatusData._id);
	if (arrayIndex !== -1) {
		userStatus.packages.customUserStatusData.list.splice(arrayIndex, 1);
	}
};

export const updateCustomUserStatus = function (customUserStatusData) {
	const newUserStatus = {
		name: customUserStatusData.name,
		id: customUserStatusData._id,
		statusType: customUserStatusData.statusType,
		localizeName: false,
	};

	const arrayIndex = userStatus.packages.customUserStatus.list.indexOf(newUserStatus.id);
	if (arrayIndex === -1) {
		userStatus.packages.customUserStatus.list.push(newUserStatus);
	} else {
		userStatus.packages.customUserStatus.list[arrayIndex] = newUserStatus;
	}

	userStatus.list[newUserStatus.id] = newUserStatus;
};
