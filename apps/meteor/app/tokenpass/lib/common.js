import { CustomOAuth } from '../../custom-oauth';

export const config = {
	serverURL: '',
	identityPath: '/oauth/user',
	authorizePath: '/oauth/authorize',
	tokenPath: '/oauth/access-token',
	scope: 'user',
	tokenSentVia: 'payload',
	usernameField: 'username',
	mergeUsers: true,
	addAutopublishFields: {
		forLoggedInUser: ['services.tokenpass'],
		forOtherUsers: ['services.tokenpass.name'],
	},
	accessTokenParam: 'access_token',
};

export const Tokenpass = new CustomOAuth('tokenpass', config);
