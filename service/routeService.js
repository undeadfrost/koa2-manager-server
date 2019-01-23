const SysUser = require('../models/SysUser')
const SysMenu = require('../models/SysMenu')
const Sequelize = require('sequelize')
const {objArrayDoWeight, menusOrder} = require('../common/utils')

const Op = Sequelize.Op
let routeService = {}

routeService.getMenu = async (user) => {
	let SysMenuList = []
	try {
		let roles = await user.getSys_roles()
		for (let i = 0; i < roles.length; i++) {
			let menus = await roles[i].getSys_menus()
			menus.forEach(menu => {
				SysMenuList.push(menu)
			})
		}
	} catch (e) {
		console.log(e)
		return []
	}
	SysMenuList = menusOrder(objArrayDoWeight(SysMenuList))
	let permissions = []
	let navList = []
	SysMenuList.forEach(SysMenu => {
		delete SysMenu.dataValues.sys_role_menu
		if (SysMenu.type === 1) permissions.push(SysMenu.permission)
		delete SysMenu.dataValues.permission
		if (SysMenu.parent === 0) navList.push(SysMenu)
	})
	navList.forEach(item => {
		if (item.type === 0) {
			item.setDataValue('submenus', SysMenuList.filter(SysMenu => {
				return SysMenu.type !== 2 && item.id === SysMenu.parent
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
	const menuList = await SysMenu.findAll({order: ['orderNum']})
	return menuList
}

routeService.addRoute = async (parent, routeName, menuRoute, menuPermission, icon, orderNum, type) => {
	try {
		await SysMenu.create({
			parent: parent,
			name: routeName,
			route: menuRoute,
			permission: menuPermission,
			icon: icon,
			orderNum: orderNum,
			type: type
		})
		return {code: 0, msg: '新增成功！'}
	} catch (e) {
		return {code: 1, msg: '新增失败！'}
	}
}

routeService.delRoute = async (menuId) => {
	try {
		await SysMenu.destroy({
			where: {
				[Op.or]: [{id: menuId}, {parent: menuId}]
			}
		})
		return {code: 0, msg: '删除成功！'}
	} catch (e) {
		return {code: 1, msg: '删除失败！'}
	}
}

routeService.getRouteInfo = async (menuId) => {
	const menu = await SysMenu.findById(menuId)
	return {code: 0, menu: menu}
}

routeService.putRouteInfo = async (meunId, menuRoute, menuPermission, routeName, icon, orderNum, parentMenu, type) => {
	const menuInfo = await SysMenu.findById(meunId)
	let fields = ['name', 'icon', 'orderNum', 'type']
	if (type === 1) {
		fields = fields.concat(['parent', 'route', 'permissions'])
	}
	try {
		await menuInfo.update({
			name: routeName,
			parent: parentMenu,
			route: menuRoute,
			permissions: menuPermission,
			icon: icon,
			orderNum: orderNum,
			type: type
		}, {fields: fields})
		return {code: 0, msg: '更新成功！'}
	} catch (e) {
		return {code: 1, msg: '更新失败！'}
	}
	
}

module.exports = routeService
