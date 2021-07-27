const bcrypt = require('bcrypt');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config/config');
const db = require('./services/db');
passport.use(
	'local',
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password'
		},
		(username, password, done) => {
			db
				.query('select * from users where username=?', [ username ])
				.then(
					async (results, fields) => {
						const user = results[0];
						if (user) {
							const validPassword = await bcrypt.compare(password, user.password);
							if (validPassword) {
								return done(null, user);
							} else {
								return done(null, false);
							}
						} else {
							return done(null, false);
						}
					},
					(err) => done(err, false)
				)
				.catch((err) => done(err, false));
		}
	)
);
passport.serializeUser(function(user, done) {
	done(null, user.username);
});
passport.deserializeUser(function(username, done) {
	db.query('select * from users where username=?', [ username ]).then(function(err, rows) {
		done(err, rows[0]);
	});
});

const getToken = function(user) {
	return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

passport.use(
	new JwtStrategy(opts, (jwt_payload, done) => {
		console.log('JWT payload: ', jwt_payload);

		db
			.query('select * from users where username=?', [ jwt_payload._id ])
			.then(
				async (results, fields) => {
					const user = results[0];
					if (user) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				},
				(err) => done(err, false)
			)
			.catch((err) => done(err, false));
	})
);

const verifyUser = passport.authenticate('jwt', { session: false });

module.exports = { passport, verifyUser, getToken };
