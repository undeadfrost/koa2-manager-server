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
		ctx.body = ctx.header
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
