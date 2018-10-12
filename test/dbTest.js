const User = require('../models/user')
const Role = require('../models/role')

const db = async () => {
	let user = await User.create({
		username: 'libo',
		password: '123456',
	})
	let role = await Role.findById(1)
	await user.addRole(role)
}

db()
