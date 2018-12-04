const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const SysUser = require('../models/SysUser')
const SysRole = require('../models/SysRole')
const Sequelize = require('sequelize')

const Op = Sequelize.Op
let userService = {}

userService.register = async (username, password) => {
	// 查询用户是否存在
	const existUser = await SysUser.findOne({where: {username: username}})
	
	if (existUser) {
		return '用户已存在'
	} else {
		// 密码加密
		const salt = bcrypt.genSaltSync(10)
		const hashPassword = bcrypt.hashSync(password, salt)
		
		// 创建用户
		await SysUser.create({username: username, password: hashPassword})
		const newUser = await SysUser.findOne({where: {username}})
		
		if (newUser) {
			return 'success'
		}
		return 'error'
	}
}

userService.login = async (username, password) => {
	// 查询用户是否存在
	const user = await SysUser.findOne({where: {username: username}})
	if (user && user.status) {
		if (bcrypt.compareSync(password, user.password)) {
			// 签发Token
			const payload = {
				id: user.id,
				username: user.username
			}
			const token = jsonwebtoken.sign(payload, 'secret', {expiresIn: '3600s'})
			const userInfo = {
				username: user.username,
				mobile: user.mobile,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			}
			return {code: 0, msg: '登录成功', token: token, userInfo: userInfo}
		} else {
			return {code: 1, msg: '密码错误'}
		}
	} else {
		return {code: 1, msg: '用户不存在'}
	}
}

userService.getUserList = async (user, searchKey) => {
	let userList = await SysUser.findAll({
		where: {
			username: {
				[Op.like]: `%${searchKey}%`
			}
		}
	})
	return userList
}

userService.getUserInfo = async (userId) => {
	const user = await SysUser.findById(userId)
	let userRoles = await user.getSys_roles()
	if (userRoles.length > 0) {
		user.setDataValue('roles', userRoles)
	} else {
		user.setDataValue('roles', [])
	}
	delete user.dataValues.password
	delete user.dataValues.updatedAt
	delete user.dataValues.createUserId
	return {userInfo: user}
}

userService.addUser = async (createUser, username, password, mobile, status, roleIds) => {
	// 查询用户是否存在
	const existUser = await SysUser.findOne({where: {username: username}})
	if (existUser) {
		return {code: 1, msg: '用户名已存在'}
	} else {
		// 密码加密
		const salt = bcrypt.genSaltSync(10)
		const hashPassword = bcrypt.hashSync(password, salt)
		let user = {}
		// 新增用户
		try {
			user = await SysUser.create({
				username: username,
				password: hashPassword,
				mobile: mobile,
				status: status,
				createUserId: createUser.id
			})
		} catch (e) {
			return {code: 1, msg: '新增失败'}
		}
		if (roleIds) {
			const roles = await SysRole.findAll({where: {id: roleIds}})
			await user.setSys_roles(roles)
		}
		return {code: 0, msg: '新增成功'}
	}
}

userService.delUser = async (userId) => {
	try {
		await SysUser.destroy({where: {id: userId}})
		return {code: 0, msg: '删除成功'}
	} catch (e) {
		return {code: 0, msg: '删除错误'}
	}
}

userService.putUserInfo = async (userId, username, password, mobile, status, roleIds) => {
	const user = await SysUser.findById(userId)
	let fields = ['username', 'status']
	if (password) {
		const salt = bcrypt.genSaltSync(10)
		password = bcrypt.hashSync(password, salt)
		fields.push('password')
	}
	if (mobile) {
		fields.push('mobile')
	}
	try {
		await user.update({
			username: username,
			password: password,
			mobile: mobile,
			status: status
		}, {fields: fields})
		const roles = await SysRole.findAll({where: {id: roleIds}})
		await user.setSys_roles(roles)
		return {code: 0, msg: '修改成功'}
	} catch (e) {
		return {code: 1, msg: '修改失败'}
	}
}

module.exports = userService
