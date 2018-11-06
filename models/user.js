const sequelize = require('../lib/mysql')
const Role = require('./role')
const Sequelize = sequelize.Sequelize

const User = sequelize.define('user', {
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
	createUserId: {
		type: Sequelize.INTEGER(11),
		defaultValue: 1,
		allowNull: false
	}
}, {freezeTableName: true})

User.belongsToMany(Role, {through: 'user_role', foreignKey: 'userId', timestamps: false})
Role.belongsToMany(User, {through: 'user_role', foreignKey: 'roleId', timestamps: false})
module.exports = User


