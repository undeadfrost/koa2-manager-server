const sequelize = require('../lib/mysql')
const Sequelize = sequelize.Sequelize

const SysMenu = sequelize.define('sys_menu', {
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
	permission: {
		type: Sequelize.STRING(100),
	},
	type: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
	},
	icon: {
		type: Sequelize.STRING(100),
	},
	orderNum: {
		type: Sequelize.INTEGER(11),
	}
}, {freezeTableName: true, timestamps: false})

module.exports = SysMenu
