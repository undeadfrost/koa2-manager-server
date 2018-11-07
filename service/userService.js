const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')
const Role = require('../models/role')
const Sequelize = require('sequelize')

const Op = Sequelize.Op
let userService = {}

userService.register = async (username, password) => {
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

userService.login = async (username, password) => {
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
			return {code: 0, msg: '登录成功', token: token}
		} else {
			return {code: 1, msg: '密码错误'}
		}
	} else {
		return {code: 1, msg: '用户不存在'}
	}
}

userService.getUserList = async (username, searchKey) => {
	// 查询用户是否存在
	const createUser = await User.findOne({where: {username: username}})
	if (createUser) {
		let userList = await User.findAll({
			where: {
				createUserId: createUser.createUserId, username: {
					[Op.like]: `%${searchKey}%`
				}
			}
		})
		return userList
	} else {
		return []
	}
}

userService.getUserInfo = async (username, userId) => {
	const createUser = await User.findOne({where: {username: username}})
	const user = await User.findById(userId)
	if (createUser.id === user.createUserId) {
		let userRole = (await user.getRoles())[0]
		if (userRole) {
			delete userRole.dataValues.user_role
			user.setDataValue('role', userRole)
		} else {
			user.setDataValue('role', null)
		}
		delete user.dataValues.password
		delete user.dataValues.updatedAt
		delete user.dataValues.createUserId
		return {code: 0, userInfo: user}
	} else {
		return {code: 1, msg: '无权查看'}
	}
}

userService.addUser = async (createUser, username, password, mobile, status, roleId) => {
	// 查询用户是否存在
	const existUser = await User.findOne({where: {username: username}})
	if (existUser) {
		return {code: 1, msg: '用户名已存在'}
	} else {
		// 密码加密
		const salt = bcrypt.genSaltSync(10)
		const hashPassword = bcrypt.hashSync(username + password, salt)
		let user = {}
		// 新增用户
		try {
			user = await User.create({
				username: username,
				password: hashPassword,
				mobile: mobile,
				status: status,
				createUserId: createUser.id
			})
		} catch (e) {
			return {code: 1, msg: '新增失败'}
		}
		if (roleId) {
			const role = await Role.findById(roleId)
			if (role && role.createUserId === createUser.id) {
				await user.setRoles(role)
			} else {
				return {code: 1, msg: '角色错误'}
			}
		}
		return {code: 0, msg: '新增成功'}
	}
}

userService.putUserInfo = async (createUser, userId, username, password, mobile, status, roleId) => {
	const user = await User.findById(userId)
	if (user && createUser.id === user.createUserId) {
		let fields = ['username', 'status']
		if (password) {
			const salt = bcrypt.genSaltSync(10)
			password = bcrypt.hashSync(username + password, salt)
			fields.push('password')
		}
		if (mobile) {
			fields.push('mobile')
		}
		await user.update({
			username: username,
			password: password,
			mobile: mobile,
			status: status
		}, {fields: fields})
		return {code: 0, msg: '修改成功'}
	} else {
		return {code: 1, msg: '参数有误'}
	}
}

module.exports = userService
