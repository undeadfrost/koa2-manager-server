const sequelize = require('../lib/mysql')
const Sequelize = sequelize.Sequelize
const Resource = require('./resource')

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
	remark: {
		type: Sequelize.STRING(255),
	},
	createUserId: {
		type: Sequelize.INTEGER(11),
		allowNull: false
	}
}, {freezeTableName: true, timestamps: false})

Role.belongsToMany(Resource, {through: 'role_resource', foreignKey: 'roleId', timestamps: false})
Resource.belongsToMany(Role, {through: 'role_resource', foreignKey: 'resourceId', timestamps: false})

module.exports = Role
