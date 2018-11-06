const User = require('../models/user')

let commoneService = {}

commoneService.getCreateUser = async (username) => {
	const user = User.findOne({where: {username: username}})
	if (!user) {
		return false
	}
	return user
}

module.exports = commoneService
