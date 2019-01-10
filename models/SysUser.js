const sequelize = require('../lib/mysql')
const SysRole = require('./SysRole')
const Sequelize = sequelize.Sequelize

const SysUser = sequelize.define('sys_user', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	username: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	password: {
		type: Sequelize.STRING(255),
		allowNull: false
	},
	mobile: {
		type: Sequelize.STRING(13),
	},
	status: {
		type: Sequelize.BOOLEAN,
		defaultValue: 0
	},
	portrait: {
		type: Sequelize.STRING(255),
		defaultValue: '/uploads/portrait_default.png'
	},
	createUserId: {
		type: Sequelize.INTEGER(11),
	}
}, {freezeTableName: true})

SysUser.belongsToMany(SysRole, {through: 'sys_user_role', foreignKey: 'userId', timestamps: false})
SysRole.belongsToMany(SysUser, {through: 'sys_user_role', foreignKey: 'roleId', timestamps: false})
module.exports = SysUser


