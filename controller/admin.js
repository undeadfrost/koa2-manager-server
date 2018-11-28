const commonService = require('../service/commonService')
const userService = require('../service/userService')
const routeService = require('../service/routeService')
const roleService = require('../service/roleService')

let adminController = {}

adminController.register = () => {
	return async (ctx) => {
		const {username, password} = ctx.request.body
		ctx.body = await userService.register(username, password)
	}
}

adminController.login = () => {
	return async (ctx) => {
		const {username, password} = ctx.request.body
		ctx.body = await userService.login(username, password)
	}
}

adminController.getMenu = () => {
	return async (ctx) => {
		const {id} = ctx.state.user
		const user = await commonService.getUser(id)
		ctx.body = await routeService.getMenu(user)
	}
}

adminController.getUserInfo = () => {
	return async (ctx) => {
		const {userId} = ctx.query
		ctx.body = await userService.getUserInfo(userId)
	}
}

adminController.getUserList = () => {
	return async (ctx) => {
		let {searchKey} = ctx.query
		if (!searchKey) searchKey = ''
		ctx.body = await userService.getUserList(ctx.user, searchKey)
	}
}

adminController.addUser = () => {
	return async (ctx) => {
		const {username, password, confirm, mobile, status, roleIds} = ctx.request.body
		if (password === confirm && roleIds.length > 0) {
			ctx.body = await userService.addUser(ctx.user, username, password, mobile, status, roleIds)
		} else {
			ctx.body = {code: 1, msg: '参数有误'}
		}
	}
}

adminController.delUser = () => {
	return async (ctx) => {
		const {userId} = ctx.query
		if (userId) {
			ctx.body = await userService.delUser(userId)
		} else {
			ctx.body = {code: 1, msg: '参数有误'}
		}
	}
}

adminController.putUserInfo = () => {
	return async (ctx) => {
		const {userId, username, password, confirm, mobile, status, roleIds} = ctx.request.body
		if (userId && username && status && roleIds.length > 0 && password === confirm) {
			ctx.body = await userService.putUserInfo(userId, username, password, mobile, status, roleIds)
		} else {
			ctx.body = {code: 1, msg: '参数有误'}
		}
	}
}

adminController.getAuth = () => {
	return async (ctx, next) => {
		const {route} = ctx.request.body
		const {id} = ctx.state.user
		const user = await commonService.getUser(id)
		ctx.body = await routeService.getAuth(user, route)
	}
}

adminController.getRole = () => {
	return async (ctx) => {
		let {roleName} = ctx.query
		if (!roleName) roleName = ''
		ctx.body = await roleService.getRole(ctx.user, roleName)
	}
}

adminController.addRole = () => {
	return async (ctx) => {
		const {roleName, remark} = ctx.request.body
		if (roleName) {
			ctx.body = await roleService.addRole(ctx.user, roleName, remark)
		} else {
			ctx.body = {code: 1, msg: '参数有误'}
		}
	}
}

adminController.delRole = () => {
	return async (ctx) => {
		const {roleIds} = ctx.query
		ctx.body = await roleService.delRole(roleIds)
	}
}

adminController.putRole = () => {

}

adminController.saveRoleInfo = () => {
	return async (ctx) => {
		let {roleId, menuIds} = ctx.request.body
		if (!menuIds) menuIds = []
		ctx.body = await roleService.saveRoleInfo(ctx.user, roleId, menuIds)
	}
}

adminController.getRoleInfo = () => {
	return async (ctx) => {
		const {roleId} = ctx.query
		ctx.body = await roleService.getRoleInfo(ctx.user, roleId)
	}
}

adminController.getRoute = () => {
	return async (ctx) => {
		ctx.body = await routeService.getRoute()
	}
}

adminController.addRoute = () => {
	return async (ctx) => {
		const {parent, routeName, menuRoute, menuPermission, icon, orderNum, type} = ctx.request.body
		if (type && type === "0") {
			if (routeName && orderNum) {
				ctx.body = await routeService.addRoute(0, routeName, menuRoute, menuPermission, icon, orderNum, type)
			} else {
				ctx.body = {code: 1, msg: '参数有误！'}
			}
		} else if (type && type === "1") {
			if (parent && routeName && menuRoute && orderNum) {
				ctx.body = await routeService.addRoute(parent, routeName, menuRoute, menuPermission, icon, orderNum, type)
			} else {
				ctx.body = {code: 1, msg: '参数有误！'}
			}
		} else {
			ctx.body = {code: 1, msg: '参数有误！'}
		}
	}
}

adminController.delRoute = () => {
	return async (ctx) => {
		const {menuId} = ctx.query
		ctx.body = await routeService.delRoute(menuId)
	}
}

module.exports = adminController
