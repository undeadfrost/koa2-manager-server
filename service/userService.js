const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')

const register = async (username, password) => {
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
		
		if (newUser) {
			return 'success'
		}
		return 'error'
	}
}

const login = async (username, password) => {
	// 查询用户是否存在
	const user = await User.findOne({where: {username: username}})
	if (user) {
		if (bcrypt.compareSync(username + password, user.password)) {
			// 签发Token
			const payload = {
				id: user.id,
				username: user.username
			}
			const token = jsonwebtoken.sign(payload, 'secret', {expiresIn: '30s'})
			return token
		} else {
			return {code: 1, msg: '密码错误'}
		}
	} else {
		return {code: 1, msg: '用户不存在'}
	}
}

module.exports = {register, login}
