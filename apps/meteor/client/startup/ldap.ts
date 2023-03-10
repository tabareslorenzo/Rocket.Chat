import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

declare module 'meteor/meteor' {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Meteor {
		function loginWithLDAP(username: string | object, password: string, callback?: (err?: Meteor.Error | Meteor.TypedError) => void): void;
	}
}

Meteor.loginWithLDAP = function (
	username: string | object,
	password: string,
	callback?: (err?: Meteor.Error | Meteor.TypedError) => void,
): void {
	Accounts.callLoginMethod({
		methodArguments: [
			{
				ldap: true,
				username,
				ldapPass: password,
				ldapOptions: {},
			},
		],
		userCallback: callback,
	});
};
