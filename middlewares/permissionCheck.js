const Sequelize = require('sequelize')
const sysUser = require('../models/SysUser')

const Op = Sequelize.Op

const permissionChenk = (permission) => {
    return async (ctx, next) => {
        const {id} = ctx.state.user
        const user = await sysUser.findById(id)
        ctx.user = user
        if (!user) {
            return ctx.body = {code: 1, msg: '无权操作'}
        }
        if (!permission) {
            return next()
        }
        const roles = await user.getSys_roles()
        for (let i = 0; i < roles.length; i++) {
            let menus = await roles[i].getSys_menus({where: {permission: {[Op.like]: `%${permission}%`}}})
            if (menus.length === 1) {
                return next()
            }
        }
        return ctx.body = {code: 1, msg: '无权操作'}
    }
}

module.exports = permissionChenk
