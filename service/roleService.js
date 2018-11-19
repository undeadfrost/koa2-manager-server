const SysRole = require('../models/SysRole')
const SysUser = require('../models/SysUser')
const SysMenu = require('../models/SysMenu')
const Sequelize = require('sequelize')
const {isContained, objArrayDoWeight} = require('../common/utils')

const Op = Sequelize.Op
let roleService = {}

roleService.getRole = async (user, roleName) => {
    const roles = await SysRole.findAll({
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
        const role = await SysRole.create({roleName: roleName, remark: remark, createUserId: user.id})
    } catch (e) {
        return {code: 1, msg: '新增失败'}
    }
    return {code: 0, msg: '新增成功'}
}

roleService.delRole = async (roleIds) => {
    const del = await SysRole.destroy({where: {id: roleIds}})
    if (del === 1) {
        return {code: 0, msg: '删除成功'}
    } else {
        return {code: 1, msg: '删除失败'}
    }
}

roleService.saveRoleInfo = async (user, roleId, menuIds) => {
    const role = await SysRole.findById(roleId)
    const userRoles = await user.getSys_roles()
    let userMenuAll = []
    for (let i = 0; i < userRoles.length; i++) {
        userMenuAll = userMenuAll.concat(await userRoles[i].getSys_menus())
    }
    let userMenuIds = userMenuAll.map(item => (item.id))
    if (!isContained(userMenuIds, menuIds)) {
        return {code: 1, msg: '参数有误'}
    }
    try {
        const menus = await SysMenu.findAll({where: {id: menuIds}})
        await role.setSys_menus(menus)
    } catch (e) {
        return {code: 1, msg: '新增失败'}
    }
    return {code: 0, msg: '新增成功'}
}

roleService.getRoleInfo = async (user, roleId) => {
    const userRoles = await user.getSys_roles()
    let userMenuAll = []
    for (let i = 0; i < userRoles.length; i++) {
        userMenuAll = userMenuAll.concat(await userRoles[i].getSys_menus({order: ['orderNum']}))
    }
    userMenuAll = objArrayDoWeight(userMenuAll)
    const role = await SysRole.findById(roleId)
    let roleMenu = []
    let temp = await role.getSys_menus({where: {type: 1}})
    temp.forEach(item => {
        roleMenu.push(item.id.toString())
    })
    return {code: 0, roleMenu: roleMenu, userMenuAll: userMenuAll}
}


module.exports = roleService
