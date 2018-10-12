const sequelize = require('../lib/mysql')
const Sequelize = sequelize.Sequelize

const Role = sequelize.define('role', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	roleName: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
}, {freezeTableName: true, timestamps: false})

module.exports = Role
