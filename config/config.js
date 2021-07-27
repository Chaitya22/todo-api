module.exports = {
	HOST: 'localhost',
	USER: 'root',
	PASSWORD: 'root',
	DB: 'todo',
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	secretKey: '12345-67890-09876-54321',
	secretEncryption: 'missionImpossible'
};
