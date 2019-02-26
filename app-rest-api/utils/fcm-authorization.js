const { google } = require('googleapis');
const MESSAGE_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [ MESSAGE_SCOPE ];

module.exports = {
	getAccessToken: () => {
		return new Promise((resolve, reject) => {
			const key = require('../service-account.json');
			const jwtClient = new google.auth.JWT(
				key.client_email,
				null,
				key.private_key,
				SCOPES,
				null
			);

			jwtClient.authorize((err, tokens) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(tokens.access_token);
			});
		});
	}
};