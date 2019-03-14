const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const dbHelper = require('./databaseHelper');
const { isValidPassword } = require('./bcrypt-hash');
const { JWT_SECRET } = require('../configurations');

/**
 * JSON WEB TOKEN STRATEGY CONFIGURATION
 */
passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: JWT_SECRET
}, async (payload, done) => {
	try {
		const exp = payload.exp;
		if (exp < new Date().getTime()) {
			return done(null, false);
		}

		const id = payload.sub;
		const queryString = `SELECT * FROM users WHERE id = ${id}`;
		dbHelper.query(queryString, (results) => {
			user = results[0];

			if (!user) {
				return done(null, false);
			}

			done(null, user);
		});
	}
	catch(error) {
		done(error, false);
	}
}));

/**
 * LOCAL STRATEGY CONFIGURATION
 */
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, async (email, password, done) => {
	try {
		const queryString = `SELECT * FROM users WHERE email = '${email}'`;
		dbHelper.query(queryString, async (results) => {
			user = results[0];

			if (!user) {
				return done(null, false);
			}

			const isValidated = await isValidPassword(password, user);
			if (!isValidated) {
				return done(null, false);
			}

			done(null, user);
		});
	}
	catch(error) {
		done(error, false);
	}
}));

module.exports = passport;