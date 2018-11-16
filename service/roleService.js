const sysRole = require('../models/SysRole')
const sysUser = require('../models/SysUser')
const Resource = require('../models/SysMenu')
const Sequelize = require('sequelize')
const {isContained} = require('../common/utils')

const Op = Sequelize.Op
let roleService = {}

roleService.getRole = async (user, roleName) => {
	const roles = await sysRole.findAll({
		where: {
			roleName: {
				[Op.like]: `%${roleName}%`
			}
		}
	})
	return roles
}

roleService.addRole = async (user, roleName, remark) => {
	try {
		const role = await sysRole.create({roleName: roleName, remark: remark, createUserId: user.id})
	} catch (e) {
		return {code: 1, msg: '新增失败'}
	}
	return {code: 0, msg: '新增成功'}
}

roleService.delRole = async (roleIds) => {
	const del = await sysRole.destroy({where: {id: roleIds}})
	if (del === 1) {
		return {code: 0, msg: '删除成功'}
	} else {
		return {code: 1, msg: '删除失败'}
	}
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

roleService.getRoleInfo = async (user, roleId) => {
	const userRoles = await user.getSys_roles()
	const role = await sysRole.findById(roleId)
	let sysMenuAll = await role.getSys_menus()
	let sysRoleMenu = []
    sysMenuAll.forEach(item => {
		response.push(item.id.toString())
	})
	return {code: 0, sysRoleMenu: sysRoleMenu, sysMenuAll: sysMenuAll}
}


module.exports = roleService
