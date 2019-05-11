const SysUser = require('../models/SysUser')

let commoneService = {}

commoneService.getUser = async (userId) => {
	const user = SysUser.findByPk(userId)
	if (!user) {
		return false
	}
	return user
}

module.exports = commoneService
