module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
		username: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		}
	});

	return User;
};
