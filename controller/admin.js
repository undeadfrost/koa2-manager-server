const userService = require('../service/userService')
const routeService = require('../service/routeService')

exports.register = () => {
	return async (ctx) => {
		const data = ctx.request.body
		let username = data['username']
		let password = data['password']
		let re = await userService.register(username, password)
		ctx.body = re
	}
}

exports.login = () => {
	return async (ctx) => {
		const data = ctx.request.body
		let username = data['username']
		let password = data['password']
		let re = await userService.login(username, password)
		ctx.body = re
	}
}

exports.getMenu = () => {
	return async (ctx) => {
		const user = ctx.state.user
		ctx.body = await routeService.getMenu(user.username)
	}
}

exports.getUserInfo = () => {
	return async (ctx, next) => {
		ctx.body = ctx.header
	}
}

exports.getAuth = () => {
	return async (ctx, next) => {
		const data = ctx.request.body
		const route = data['route']
		const user = ctx.state.user
		ctx.body = await routeService.getAuth(user.username, route)
	}
}
