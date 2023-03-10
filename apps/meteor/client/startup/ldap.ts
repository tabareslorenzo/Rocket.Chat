import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

declare module 'meteor/meteor' {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Meteor {
		function loginWithLDAP(username: string, password: string, callback?: (err?: any) => void): void;
	}
}

Meteor.loginWithLDAP = function (username: string, password: string, callback?: (err?: any) => void): void {
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
