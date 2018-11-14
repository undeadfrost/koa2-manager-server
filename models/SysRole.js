const sequelize = require('../lib/mysql')
const Sequelize = sequelize.Sequelize
const sysMenu = require('./SysMenu')

const SysRole = sequelize.define('sys_role', {
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
	remark: {
		type: Sequelize.STRING(255),
	},
	createUserId: {
		type: Sequelize.INTEGER(11),
	}
}, {freezeTableName: true, timestamps: false})

SysRole.belongsToMany(sysMenu, {through: 'sys_role_menu', foreignKey: 'roleId', timestamps: false})
sysMenu.belongsToMany(SysRole, {through: 'sys_role_menu', foreignKey: 'menuId', timestamps: false})

module.exports = SysRole
