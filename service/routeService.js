const User = require('../models/user')

const getMenu = async (username) => {
	const user = await User.findOne({where: {username: username}})
	const role = (await user.getRoles())[0]
	const resourceList = await role.getResources()
	const menu = resourceList.filter((resource) => {
		delete resource.dataValues.role_resource
		return resource.parent === 0
	})
	menu.forEach(item => {
		item.setDataValue('submenus', resourceList.filter(resource => {
			return item.id === resource.parent
		}))
	})
	return menu
}

const getAuth = async (username, route) => {
	const user = await User.findOne({where: {username: username}})
	const role = (await user.getRoles())[0]
	const resourceList = await role.getResources({where: {route: route}})
	if (resourceList.length > 0) {
		return {'isAuth': true}
	} else {
		return {'isAuth': false}
	}
}

module.exports = {getMenu, getAuth}
