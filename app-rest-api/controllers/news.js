const request = require('request');
const dbHelper = require('../utils/databaseHelper');
const fcmAuth = require('../utils/fcm-authorization');
const { NEWS_STATUS, NEWS_POST_NOTIFICATION, ROLES } = require('../utils/types')

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
			/**
			 * All posible scenerios
			 * --- All news must be in accepted status ---
			 * - Get all news without condition (admin)
			 * - Get all news with limit (users)
			 * - Get all news with author (users)
			 */
			const fromIndex = req.query.fromIndex;
			const limit = req.query.limit;
			const authorId = req.query.authorId;
			let queryString = `SELECT news.id, news.title, news.content, news.contentNotification, users.name AS 'author', news.postdate, news.imgUrl, news.status, news.isnotified FROM news INNER JOIN users ON news.authorId = users.id`;
			let condition = ` WHERE news.status = '${ NEWS_STATUS.ACCEPTED }'`;

			if (authorId) {
				condition += ` AND news.authorId = '${authorId}'`;
			}

			queryString += condition;
			queryString += ` ORDER BY news.id DESC`;

			if (fromIndex && limit) {
				queryString += ` LIMIT ${fromIndex}, ${limit}`
			}

			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	getNewsWithCondition: (req, res, next) => {
		controllerHandler(next, () => {
			/**
			 * All posible scenerios
			 * --- Editors ---
			 * - Get all editor news
			 * - Get all editor news with limit
			 * - Get all editor news with status (PENDING/ACCEPTED)
			 * - Get all editor news with notification status (WAITING/SENT)
			 * 
			 * * --- Admin ---
			 * - Get all news with limit
			 * - Get all news with status (PENDING/ACCEPTED)
			 * - Get all news with notification status (WAITING/SENT)
			 */
			const fromIndex = req.query.fromIndex;
			const limit = req.query.limit;
			const authorId = (req.user.role === ROLES.ADMIN) ? req.query.authorId : req.user.id;
			const status = req.query.status;
			const isnotified = req.query.isnotified;

			let queryString = `SELECT news.id, news.title, news.content, news.contentNotification, users.name AS 'author', news.postdate, news.imgUrl, news.status, news.isnotified FROM news INNER JOIN users ON news.authorId = users.id`;
			let condition = ' WHERE';
			let isCondition = false;

			if (status) {
				condition += ` news.status = '${status}'`;
				isCondition = true;
			}

			if (authorId) {
				if (isCondition) {
					condition += ` AND`;
				}
				condition += ` news.authorId = '${authorId}'`;
				isCondition = true;
			}

			if (isnotified) {
				if (isCondition) {
					condition += ` AND`;
				}
				condition += ` news.isnotified = '${isnotified}'`;
				isCondition = true;
			}

			if (isCondition) {
				queryString += condition;
			}

			queryString += ` ORDER BY news.id DESC`;

			if (fromIndex && limit) {
				queryString += ` LIMIT ${fromIndex}, ${limit}`
			}

			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	createPendingNews: (req, res, next) => {
		controllerHandler(next, () => {
			const id = null;
			const title = `'${req.body.title}'`;
			const content = `'${req.body.content}'`;
			const contentNotification = `'${req.body.contentNotification}'`;
			const authorId = `'${req.body.authorId}'`;
			const postdate = `NOW()`;
			const status = `'${NEWS_STATUS.PENDING}'`;
			const isnotified = `'${NEWS_POST_NOTIFICATION.WAITING}'`;

			const queryString = `INSERT INTO news (id, title, content, contentNotification, authorId, postdate, status, isnotified) VALUES (${id}, ${title}, ${content}, ${contentNotification}, ${authorId}, ${postdate}, ${status}, ${isnotified})`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	createNews: (req, res, next) => {
		controllerHandler(next, () => {
			const id = null;
			const title = `'${req.body.title}'`;
			const content = `'${req.body.content}'`;
			const contentNotification = `'${req.body.contentNotification}'`;
			const authorId = `'${req.body.authorId}'`;
			const postdate = `NOW()`;
			const status = `'${NEWS_STATUS.ACCEPTED}'`;
			const isnotified = `'${NEWS_POST_NOTIFICATION.WAITING}'`;

			const queryString = `INSERT INTO news (id, title, content, contentNotification, authorId, postdate, status, isnotified) VALUES (${id}, ${title}, ${content}, ${contentNotification}, ${authorId}, ${postdate}, ${status}, ${isnotified})`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	deleteAllNews: (req, res, next) => {
		controllerHandler(next, () => {
			const queryString = `TRUNCATE TABLE news`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	getNews: (req, res, next) => {
		controllerHandler(next, () => {
			const id = `${req.params.id}`;
			const queryString = `SELECT news.id, news.title, news.content, news.contentNotification, users.name AS 'author', news.postdate, news.imgUrl, news.status, news.isnotified FROM news INNER JOIN users ON news.authorId = users.id WHERE news.id = ${id}`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	updateNewsEditorRole: (req, res, next) => {
		controllerHandler(next, () => {
			/**
			 * Can do all listed task below:
			 * --- Editors ---
			 * - Update editor news (without changing status)
			 * 
			 * --- Admin ---
			 * - Update news (including status ==> accept news)
			 */
			const id = `${req.params.id}`;
			const title = `'${req.body.title}'`;
			const content = `'${req.body.content}'`;
			const contentNotification = `'${req.body.contentNotification}'`;
			const authorId = `'${req.body.authorId}'`;
			const status = `'${req.body.status}'`;
			const isnotified = `'${req.body.isnotified}'`;

			const queryString = `UPDATE news SET title = ${title}, content = ${content}, contentNotification = ${contentNotification} WHERE id = ${id}`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	updateNewsAdminRole: (req, res, next) => {
		controllerHandler(next, () => {
			/**
			 * Can do all listed task below:
			 * --- Editors ---
			 * - Update editor news (without changing status)
			 * 
			 * --- Admin ---
			 * - Update news (including status ==> accept news)
			 */
			const id = `${req.params.id}`;
			const title = `'${req.body.title}'`;
			const content = `'${req.body.content}'`;
			const contentNotification = `'${req.body.contentNotification}'`;
			const authorId = `'${req.body.authorId}'`;
			const status = `'${req.body.status}'`;
			const isnotified = `'${req.body.isnotified}'`;

			const queryString = `UPDATE news SET title = ${title}, content = ${content}, contentNotification = ${contentNotification}, status = ${status} WHERE id = ${id}`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	deleteNews: (req, res, next) => {
		controllerHandler(next, () => {
			const id = `${req.params.id}`;
			const authorId = `'${req.body.authorId}'`;

			let queryString = `DELETE FROM news WHERE id = ${id}`;
			if (req.user.role !== ROLES.ADMIN) {
				queryString += ` AND authorId = ${authorId}`;
			}
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	pushNotificationOfNews: (req, res, next) => {
		controllerHandler(next, () => {
			const id = req.params.id;

			const queryString = `SELECT news.id, news.title, news.content, news.contentNotification, users.name AS 'author', news.postdate, news.imgUrl, news.status, news.isnotified FROM news INNER JOIN users ON news.authorId = users.id WHERE news.id = ${id}`;
			dbHelper.query(queryString, (results) => {
				if (results.length <= 0) {
					return res.status(200).json({ error: 'Không tồn tại tin này' });
				}

				const title = results[0].title;
				const body = results[0].contentNotification;
				const img_url = results[0].imgUrl;
				const content = results[0].content;
				const author = results[0].author;
				const postdate = results[0].postdate;

				fcmAuth.getAccessToken()
					.then(access_token => {
						request.post({
							headers: {
								Authorization: `Bearer ${access_token}`
							},
							url: 'https://fcm.googleapis.com/v1/projects/android-pushnotification-24c95/messages:send',
							body: JSON.stringify(
								{
									"message":{
										"topic" : "updates",
										"data": {
											"id": id,
											"body" : body,
											"title" : title,
											"img_url": img_url,
											"content": content,
											"author": author,
											"postdate": postdate
										}
									}
								}
							)
						}, (error, response, body) => {
							if (error) throw error;

							const isnotified = `'${NEWS_POST_NOTIFICATION.SENT}'`;
							const queryString = `UPDATE news SET isnotified = ${isnotified} WHERE id = ${id}`;
							
							dbHelper.query(queryString, (results) => {
								res.status(200).json({ data: results, response, body });
							});
						});
					});
			});
		});
	}
};