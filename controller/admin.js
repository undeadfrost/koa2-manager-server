const commonService = require('../service/commonService')
const userService = require('../service/userService')
const routeService = require('../service/routeService')
const roleService = require('../service/roleService')

let adminController = {}

adminController.register = () => {
	return async (ctx) => {
		const data = ctx.request.body
		let username = data['username']
		let password = data['password']
		let re = await userService.register(username, password)
		ctx.body = re
	}
}

adminController.login = () => {
	return async (ctx) => {
		const data = ctx.request.body
		let username = data['username']
		let password = data['password']
		let re = await userService.login(username, password)
		ctx.body = re
	}
}

adminController.getMenu = () => {
	return async (ctx) => {
		const user = ctx.state.user
		ctx.body = await routeService.getMenu(user.username)
	}
}

adminController.getUserInfo = () => {
	return async (ctx, next) => {
		const {username} = ctx.state.user
		const {userId} = ctx.query
		ctx.body = await userService.getUserInfo(username, userId)
	}
}

adminController.getUserList = () => {
	return async (ctx, next) => {
		const {username} = ctx.state.user
		let {searchKey} = ctx.query
		if (!searchKey) searchKey = ''
		ctx.body = await userService.getUserList(username, searchKey)
	}
}

adminController.addUser = () => {
	return async (ctx, next) => {
		const {username} = ctx.state.user
		let createUser = await commonService.getCreateUser(username)
		if (createUser) {
			const {username, password, confirm, mobile, status, roleId} = ctx.request.body
			if (password === confirm && roleId) {
				ctx.body = await userService.addUser(createUser, username, password, mobile, status, roleId)
			}
			ctx.body = {code: 1, msg: '输入有误'}
		} else {
			ctx.body = {code: 1, msg: '权限错误'}
		}
	}
}

adminController.putUserInfo = () => {
	return async (ctx, next) => {
		const {username} = ctx.state.user
		let createUser = await commonService.getCreateUser(username)
		if (createUser) {
			const {userId, username, password, confirm, mobile, status, roleId} = ctx.request.body
			if (userId && username && status && roleId && password === confirm) {
				ctx.body = await userService.putUserInfo(createUser, userId, username, password, mobile, status, roleId)
			} else {
				ctx.body = {code: 1, msg: '参数有误'}
			}
		} else {
			ctx.body = {code: 1, msg: '权限错误'}
		}
	}
}

adminController.getAuth = () => {
	return async (ctx, next) => {
		const data = ctx.request.body
		const route = data['route']
		const user = ctx.state.user
		ctx.body = await routeService.getAuth(user.username, route)
	}
}

adminController.getRole = () => {
	return async (ctx, next) => {
		const user = ctx.state.user
		let {roleName} = ctx.query
		if (!roleName) roleName = ''
		ctx.body = await roleService.getRole(user['username'], roleName)
	}
}

adminController.addRole = () => {
	return async (ctx, next) => {
		const data = ctx.request.body
		const user = ctx.state.user
		const roleName = data['roleName']
		ctx.body = await roleService.addRole(roleName, user['username'])
	}
}

adminController.delRole = () => {
	return async (ctx, next) => {
		const {username} = ctx.state.user
		const {roleIds} = ctx.query
		ctx.body = await roleService.delRole(username, roleIds)
	}
}

adminController.putRole = () => {

}

adminController.saveRoleResources = () => {
	return async (ctx, next) => {
		const {roleId, resourceIds} = ctx.request.body
		const {username} = ctx.state.user
		ctx.body = await roleService.saveRoleResource(username, roleId, resourceIds)
	}
}

adminController.getRoleResources = () => {
	return async (ctx, next) => {
		const {username} = ctx.state.user
		const {roleId, type} = ctx.query
		ctx.body = await roleService.getRoleResource(username, roleId, type)
	}
}

module.exports = adminController
