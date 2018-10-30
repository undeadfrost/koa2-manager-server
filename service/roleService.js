const Role = require('../models/role')

const getRole = async () => {
	const roles = await Role.findAll()
	return roles
}

module.exports = {getRole}
