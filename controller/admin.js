const jsonwebtoken = require('jsonwebtoken')
const {registerService} = require('../service/userService')

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
		let userToken = {
			username: data.username
		}
		const token = jsonwebtoken.sign(userToken, 'secret', {expiresIn: '1h'})
		ctx.body = {
			token
		}
	}
}

const getUserInfo = () => {
	return async (ctx) => {
		ctx.body = 'success'
	}
}

module.exports = {
	login, getUserInfo, register
}
