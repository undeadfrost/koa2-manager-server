const Role = require('../models/role')
const User = require('../models/user')
const Resource = require('../models/resource')
const Sequelize = require('sequelize')
const {isContained} = require('../common/utils')

const Op = Sequelize.Op
let roleService = {}

roleService.getRole = async (username, roleName) => {
	const createUser = await User.findOne({where: {username: username}})
	const roles = await Role.findAll({
		where: {
			createUserId: createUser.id, roleName: {
				[Op.like]: `%${roleName}%`
			}
		}
	})
	return roles
}

roleService.addRole = async (roleName, username) => {
	const createUser = await User.findOne({where: {username: username}})
	if (!createUser) {
		return {code: 1, msg: '新增失败'}
	}
	try {
		const role = await Role.create({roleName: roleName, createUserId: createUser.id})
	} catch (e) {
		return {code: 1, msg: '新增失败'}
	}
	return {code: 0, msg: '新增成功'}
}

roleService.delRole = async (username, roleIds) => {
	const user = await User.findOne({where: {username: username}})
	try {
		await Role.destroy({where: {id: roleIds, createUserId: user.id}})
	} catch (e) {
		return {code: 1, msg: '删除失败'}
	}
	return {code: 0, msg: '删除成功'}
}

roleService.saveRoleResource = async (username, roleId, resourceIds) => {
	const user = await User.findOne({where: {username: username}})
	const role = await Role.findById(roleId)
	if (user.id !== role.createUserId) {
		return {code: 1, msg: '权限校验未通过'}
	}
	const userRole = (await user.getRoles())[0]
	const userRoleResources = await userRole.getResources()
	let userResourceIds = userRoleResources.map(item => (item.id))
	if (!isContained(userResourceIds, resourceIds)) {
		return {code: 1, msg: '参数有误'}
	}
	try {
		const resources = await Resource.findAll({where: {id: resourceIds}})
		await role.setResources(resources)
	} catch (e) {
		return {code: 1, msg: '新增失败'}
	}
	return {code: 0, msg: '新增成功'}
}

roleService.getRoleResource = async (username, roleId, type) => {
	const requestUser = await User.findOne({where: {username: username}})
	const role = await Role.findById(roleId)
	if (requestUser.id !== role.createUserId) {
		return {code: 1, msg: '权限校验未通过'}
	}
	let resources = []
	if (type) {
		resources = await role.getResources({where: {type: type}})
	} else {
		resources = await role.getResources()
	}
	let response = []
	resources.forEach(item => {
		response.push(item.id.toString())
	})
	return {code: 0, resources: response}
}


module.exports = roleService
