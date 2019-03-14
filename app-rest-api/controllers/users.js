const request = require('request');
const JWT = require('jsonwebtoken');
const dbHelper = require('../utils/databaseHelper');
const fcmAuth = require('../utils/fcm-authorization');
const { NEWS_STATUS, NEWS_POST_NOTIFICATION, ROLES } = require('../utils/types')
const { JWT_SECRET } = require('../configurations')
const { hashPassword } = require('../utils/bcrypt-hash');

const controllerHandler = (next, execute) => {
	try {
		execute();
	}
	catch(error) {
		next(error);
	}
};

const signToken = (userId) => {
	return JWT.sign({
		iss: 'AppThongBaoUEH',
		sub: userId,
		iat: new Date().getTime(),
		exp: new Date().setHours(new Date().getHours() + 2)
	}, JWT_SECRET);
};

module.exports = {
	signIn: (req, res, next) => {
		controllerHandler(next, async () => {
			const id = req.user.id;
			const token = signToken(id);

			res.status(200).json({ token });
		});
	},

	getAllUsers: (req, res, next) => {
		controllerHandler(next, () => {
			let queryString = `SELECT * FROM users`;

			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},
	
	getUser: (req, res, next) => {
		controllerHandler(next, () => {
			const id = (req.user.role === ROLES.ADMIN) ? `${req.params.id}` : `${req.user.id}`;

			const queryString = `SELECT * FROM users WHERE id = ${id}`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},
	
	createUser: (req, res, next) => {
		controllerHandler(next, () => {
			const id = null;
			const email = `'${req.body.email}'`;
			const password = `'${req.body.password}'`;
			const name = `'${req.body.name}'`;
			const imgUrl = `'${req.body.imgUrl}'`;
			const role = `'${ROLES.EDITOR}'`

			const queryString = `SELECT * FROM users WHERE email = ${email}`;
			dbHelper.query(queryString, async (results) => {
				if (results.length > 0) {
					return res.status(400).json({ error: 'Email đã tồn tại' });
				}

				const passwordHashed = `'${await hashPassword(password)}'`;
	
				const queryString = `INSERT INTO users (id, email, password, name, imgUrl, role) VALUES (${id}, ${email}, ${passwordHashed}, ${name}, ${imgUrl}, ${role})`;
				dbHelper.query(queryString, (results) => {
					res.status(200).json({ data: results });
				});
			});
		});
	},

	updateUser: (req, res, next) => {
		controllerHandler(next, () => {
			const id = (req.user.role === ROLES.ADMIN) ? `${req.params.id}` : `${req.user.id}`;
			const email = `'${req.body.email}'`;
			const name = `'${req.body.name}'`;
			const imgUrl = `'${req.body.imgUrl}'`;

			const queryString = `UPDATE users SET email = ${email}, name = ${name}, imgUrl = ${imgUrl} WHERE id = ${id}`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	changePassword: (req, res, next) => {
		controllerHandler(next, async () => {
			const id = `${req.user.id}`;
			const password = `${req.body.password}`;

			const passwordHashed = `'${await hashPassword(password)}'`;

			const queryString = `UPDATE users SET password = ${passwordHashed} WHERE id = ${id}`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	deleteUser: (req, res, next) => {
		controllerHandler(next, () => {
			const id = `${req.params.id}`;

			const queryString = `DELETE FROM users WHERE id = ${id}`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	},

	deleteAllUsers: (req, res, next) => {
		controllerHandler(next, () => {
			const queryString = `TRUNCATE TABLE users`;
			dbHelper.query(queryString, (results) => {
				res.status(200).json({ data: results });
			});
		});
	}
};