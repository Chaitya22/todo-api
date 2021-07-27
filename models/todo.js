module.exports = (sequelize, Sequelize) => {
	const ToDo = sequelize.define('todo', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: Sequelize.STRING,
			allowNull: false
		},
		description: {
			type: Sequelize.STRING,
			allowNull: false
		},
		category: {
			type: Sequelize.STRING,
			allowNull: false
		},
		dueDate: {
			type: Sequelize.DATEONLY,
			allowNull: false
		}
	});

	return ToDo;
};
