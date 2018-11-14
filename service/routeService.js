const sysUser = require('../models/SysUser')
const sysMenu = require('../models/SysMenu')
const {objArrayDoWeight} = require('../common/utils')

let routeService = {}

routeService.getMenu = async (user) => {
	let sysMenuList = []
	try {
		let roles = await user.getSys_roles()
		for (let i = 0; i < roles.length; i++) {
			let menus = await roles[i].getSys_menus()
			menus.forEach(menu => {
				sysMenuList.push(menu)
			})
		}
	} catch (e) {
		console.log(e)
		return []
	}
	sysMenuList = objArrayDoWeight(sysMenuList)
	let permissions = []
	let navList = []
	sysMenuList.forEach(sysMenu => {
		delete sysMenu.dataValues.sys_role_menu
		if (sysMenu.type === 2) permissions.push(sysMenu.permission)
		delete sysMenu.dataValues.permission
		if (sysMenu.parent === 0) navList.push(sysMenu)
	})
	navList.forEach(item => {
		if (item.type === 0) {
			item.setDataValue('submenus', sysMenuList.filter(sysMenu => {
				return sysMenu.type !== 2 && item.id === sysMenu.parent
			}))
		}
	})
	return {navList: navList, permissions: permissions}
}

routeService.getAuth = async (user, route) => {
	let isAuth = false
	try {
		let roles = await user.getSys_roles()
		for (let i = 0; i < roles.length; i++) {
			let menus = await roles[i].getSys_menus({where: {route: route}})
			if (menus.length === 1) {
				isAuth = true
				break
			}
		}
	} catch (e) {
		console.log(e)
		return {'isAuth': isAuth, msg: '参数有误'}
	}
	if (isAuth) {
		return {'isAuth': true}
	} else {
		return {'isAuth': false, msg: '此账户无访问权限'}
	}
}

routeService.getRoute = async (createUser, routeName) => {
	const routeList = await Resource.findAll()
	return routeList
}

module.exports = routeService
