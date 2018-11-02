const User = require('../models/user')

const getMenu = async (username) => {
	const user = await User.findOne({where: {username: username}})
	let resourceList = []
	try {
		const role = (await user.getRoles())[0]
		resourceList = await role.getResources()
	} catch (e) {
		return []
	}
	const menu = resourceList.filter((resource) => {
		delete resource.dataValues.role_resource
		return resource.parent === 0
	})
	menu.forEach(item => {
		if (item.type === 1) {
			item.setDataValue('submenus', resourceList.filter(resource => {
				return item.id === resource.parent
			}))
		}
	})
	return menu
}

const getAuth = async (username, route) => {
	const user = await User.findOne({where: {username: username}})
	let resourceList = []
	try {
		const role = (await user.getRoles())[0]
		resourceList = await role.getResources({where: {route: route}})
	} catch (e) {
		return {'isAuth': false, msg: '此账户无访问权限'}
	}
	if (resourceList.length > 0) {
		return {'isAuth': true, msg: ''}
	} else {
		return {'isAuth': false, msg: '无权访问，请登录'}
	}
}

module.exports = {getMenu, getAuth}
