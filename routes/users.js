var express = require('express');
const db = require('../services/db');
const bcrypt = require('bcrypt');
var passport = require('passport');

const getDate = require('../services/helper');
const Authenticate = require('../authenticate');
var router = express.Router();

/* GET users listing. */
router.route('/').get(function(req, res, next) {
	db.query(`SELECT * from users `).then(
		(rows) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(rows);
		},
		(err) => next(err)
	);
});

router.post('/signup', async (req, res, next) => {
	const { username, password, name } = req.body;
	console.log(username, password, name);

	if (!(username && password && name)) {
		res.statusCode = 400;
		res.setHeader('Content-Type', 'application/json');
		res.json({ error: 'Data insufficient' });
	} else {
		const salt = await bcrypt.genSalt(10);
		const hashed_password = await bcrypt.hash(password, salt);

		db
			.query(`insert into users (username, password, name, createdAt, updatedAt) values (?,?,?,?,?)`, [
				username,
				hashed_password,
				name,
				getDate(),
				getDate()
			])
			.then(
				(results, field) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(results);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	}
});
router.post('/login', passport.authenticate('local'), (req, res, next) => {
	// const { username, password } = req.body;
	if (!req.user) {
		res.statusCode = 401;
		res.setHeader('Content-Type', 'application/json');
		res.json({ success: false, status: 'Login Unsuccesful!' });
	} else {
		var token = Authenticate.getToken({ _id: req.user.username });
		res.statusCode = 401;
		res.setHeader('Content-Type', 'application/json');
		res.json({ success: true, status: 'Login Succesful!', token: token });
	}
});

module.exports = router;

// db
// 	.query('select * from users where username=?', [ username ])
// 	.then(async (results, fields) => {
// 		const user = results[0];
// 		if (user) {
// 			const validPassword = await bcrypt.compare(password, user.password);

// 			if (validPassword) {
// 				res.status(200).json({ message: 'Valid password' });
// 			} else {
// 				res.status(400).json({ error: 'Invalid Password' });
// 			}
// 		} else {
// 			res.status(401).json({ error: 'User does not exist' });
// 		}
// 	})
// 	.catch((err) => next(err));
