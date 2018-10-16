const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')

exports.registerService = async (username, password) => {
	// 查询用户是否存在
	const existUser = await User.findOne({where: {username: username}})
	
	if (existUser) {
		return '用户已存在'
	} else {
		// 密码加密
		const salt = bcrypt.genSaltSync(10)
		const hashPassword = bcrypt.hashSync(username + password, salt)
		
		// 创建用户
		await User.create({username: username, password: hashPassword})
		const newUser = await User.findOne({where: {username}})
		
		// 签发Token
		const userToken = {
			id: newUser.id,
			username: newUser.username
		}
		const token = jsonwebtoken.sign(userToken, 'secret', {expiresIn: '12h'})
		
		return token
	}
}

exports.loginService = async (username, password) => {
	// 查询用户是否存在
	const user = await User.findOne({where: {username: username}})
	if (user) {
		if (bcrypt.compareSync(username + password, user)) {
			// 签发Token
			const userToken = {
				id: user.id,
				username: user.username
			}
			const token = jsonwebtoken.sign(userToken, 'secret', {expiresIn: '12h'})
			return token
		} else {
			return '密码错误'
		}
	} else {
		return '用户不存在'
	}
}

