const request = require('request');
const dbHelper = require('../utils/databaseHelper');
const fcmAuth = require('../utils/fcm-authorization');

const controllerHandler = (next, execute) => {
	try {
		execute();
	}
	catch(error) {
		next(error);
	}
}

module.exports = {
	getAllNews: (req, res, next) => {
		controllerHandler(next, () => {
			// res.status(200).json({ message: 'getAllNews works' });

			const queryString = `SELECT * FROM news`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	createNews: (req, res, next) => {
		controllerHandler(next, () => {
			// res.status(200).json({ message: 'createNews works' });
			const id = null;
			const title = `'${req.body.title}'`;
			const content = `'${req.body.content}'`;
			const contentNotification = `'${req.body.contentNotification}'`;
			const author = `'${req.body.author}'`;
			const postdate = `${req.body.postdate}`;

			const queryString = `INSERT INTO news (id, title, content, contentNotification, author, postdate) VALUES (${id}, ${title}, ${content}, ${contentNotification}, ${author}, ${postdate})`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	deleteAllNews: (req, res, next) => {
		controllerHandler(next, () => {
			// res.status(200).json({ message: 'deleteAllNews works' });

			const queryString = `TRUNCATE TABLE news`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	getNews: (req, res, next) => {
		controllerHandler(next, () => {
			// res.status(200).json({ message: 'getAllNews works' });

			const id = `${req.params.id}`;

			const queryString = `SELECT * FROM news WHERE id = ${id}`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	updateNews: (req, res, next) => {
		controllerHandler(next, () => {
			// res.status(200).json({ message: 'deleteAllNews works' });

			const id = `${req.params.id}`;
			const title = `'${req.body.title}'`;
			const content = `'${req.body.content}'`;
			const contentNotification = `'${req.body.contentNotification}'`;
			const author = `'${req.body.author}'`;
			// const postdate = `${req.body.postdate}`;

			const queryString = `UPDATE news SET title = ${title}, content = ${content}, contentNotification = ${contentNotification}, author = ${author} WHERE id = ${id}`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	deleteNews: (req, res, next) => {
		controllerHandler(next, () => {
			// res.status(200).json({ message: 'getAllNews works' });

			const id = `${req.params.id}`;

			const queryString = `DELETE FROM news WHERE id = ${id}`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	pushNotificationOfNews: (req, res, next) => {
		controllerHandler(next, () => {
			// res.status(200).json({ message: 'getAllNews works' });

			const id = req.params.id;

			const queryString = `SELECT * FROM news WHERE id = ${id}`;
			dbHelper.query(queryString, (results) => {
				const title = results[0].title;
				const body = results[0].contentNotification;

				fcmAuth.getAccessToken()
					.then(access_token => {
						// res.status(200).json({ token: access_token });
	
						request.post({
							headers: {
								Authorization: `Bearer ${access_token}`
							},
							url: 'https://fcm.googleapis.com/v1/projects/android-pushnotification-24c95/messages:send',
							body: JSON.stringify(
								{
									"message":{
										"topic" : "updates",
										"notification" : {
											"body" : body,
											"title" : title
										}
									}
								}
							)
						}, (error, response, body) => {
							if (error) throw error;
	
							res.status(200).json({ response, body });
						});
					});
			});
		});
	}
};