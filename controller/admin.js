const {registerService, loginService} = require('../service/userService')

const register = () => {
	return async (ctx) => {
		const data = ctx.request.body
		let username = data['username']
		let password = data['password']
		let re = await registerService(username, password)
		ctx.body = re
	}
}

const login = () => {
	return async (ctx) => {
		const data = ctx.request.body
		let username = data['username']
		let password = data['password']
		let re = await loginService(username, password)
		ctx.body = re
	}
}

const getUserInfo = () => {
	return async (ctx, next) => {
		ctx.body = ctx.header
	}
}

module.exports = {
	login, getUserInfo, register
}
