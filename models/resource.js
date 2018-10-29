const sequelize = require('../lib/mysql')
const Sequelize = sequelize.Sequelize
const Role = require('./role')

const Resource = sequelize.define('resource', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	parent: {
		type: Sequelize.INTEGER(11),
		allowNull: false
	},
	name: {
		type: Sequelize.STRING(20),
		allowNull: false
	},
	description: {
		type: Sequelize.STRING(255),
	},
	route: {
		type: Sequelize.STRING(100),
	},
}, {freezeTableName: true, timestamps: false})

module.exports = Resource