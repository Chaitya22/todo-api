var express = require('express');
const db = require('../services/db');
var passport = require('passport');
const crypto = require('crypto');

const getDate = require('../services/helper');
const Authenticate = require('../authenticate');
const secret = require('../config/config').secretEncryption;
var todoRouter = express.Router();

const algorithm = 'aes256';
var cipher = crypto.createCipher(algorithm, secret);
todoRouter
	.route('/')
	.get(Authenticate.verifyUser, (req, res, next) => {
		db
			.query(`Select * from todos where username=? order by dueDate `, [ req.user.username ])
			.then((results, fields) => {
				// var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
				// results = results.filter();
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(results);
			})
			.catch((err) => next(err));
	})
	.post(Authenticate.verifyUser, (req, res, next) => {
		const { title, description, category, dueDate } = req.body;
		if (!(title && description && category && dueDate)) {
			res.statusCode = 400;
			res.setHeader('Content-Type', 'application/json');
			res.json({ status: 'failure' });
		} else {
			var encrypted = cipher.update(description, 'utf8', 'hex') + cipher.final('hex');
			db
				.query(
					`insert into todos (title,description,category,dueDate,username,createdAt,updatedAt) values (?,?,?,str_to_date(?,"%d/%m/%Y"),?,?,?)`,
					[ title, encrypted, category, dueDate, req.user.username, getDate(), getDate() ]
				)
				.then((results) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({ status: 'success' });
				})
				.catch((err) => next(err));
		}
	})
	.delete(Authenticate.verifyUser, (req, res, next) => {
		const { id } = req.body;

		if (!id) {
			res.statusCode = 400;
			res.setHeader('Content-Type', 'application/json');
			res.json({ error: 'Provide id' });
		} else {
			db
				.query(`delete from todos where id = ?`, [ id ])
				.then((results) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(results);
				})
				.catch((err) => next(err));
		}
	});

module.exports = todoRouter;
