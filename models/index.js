const dbConfig = require('../config/config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	operatorsAliases: false,

	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle
	}
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user')(sequelize, Sequelize);
db.todos = require('./todo')(sequelize, Sequelize);

//Associations
db.users.hasMany(db.todos, { foreignKey: 'username', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.todos.belongsTo(db.users, { foreignKey: 'username', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = db;
