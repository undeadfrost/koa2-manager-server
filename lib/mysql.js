const Sequelize = require('sequelize')
const config = require('../config/default')
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
	host: config.db.host,
	dialect: config.db.dialect,
	
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	timezone: '+08:00' //东八时区
})

module.exports = sequelize
