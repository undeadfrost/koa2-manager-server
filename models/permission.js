const sequelize = require('../lib/mysql')
const Sequelize = sequelize.Sequelize
const Role = require('./role')

const Permission = sequelize.define('permission', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	permissionName: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	permissionLable: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
}, {freezeTableName: true, timestamps: false})

Role.belongsToMany(Permission, {through: 'role_permission', foreignKey: 'permissionId', timestamps: false})
Permission.belongsToMany(Role, {through: 'role_permission', foreignKey: 'roleId', timestamps: false})

module.exports = Permission
