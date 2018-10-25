const userService = require('../service/userService')
const menuService = require('../service/menuService')

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
		ctx.body = await menuService.getMenu(user.username)
	}
}

exports.getUserInfo = () => {
	return async (ctx, next) => {
		ctx.body = ctx.header
	}
}
