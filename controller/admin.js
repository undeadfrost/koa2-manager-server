const commonService = require('../service/commonService')
const userService = require('../service/userService')
const routeService = require('../service/routeService')
const roleService = require('../service/roleService')

let adminController = {}

adminController.register = () => {
    return async (ctx) => {
        const {username, password} = ctx.request.body
        ctx.body = await userService.register(username, password)
    }
}

adminController.login = () => {
    return async (ctx) => {
        const {username, password} = ctx.request.body
        ctx.body = await userService.login(username, password)
    }
}

adminController.getMenu = () => {
    return async (ctx) => {
        const {id} = ctx.state.user
        const user = await commonService.getUser(id)
        ctx.body = await routeService.getMenu(user)
    }
}

adminController.getUserInfo = () => {
    return async (ctx, next) => {
        const {username} = ctx.state.user
        const {userId} = ctx.query
        ctx.body = await userService.getUserInfo(username, userId)
    }
}

adminController.getUserList = () => {
    return async (ctx, next) => {
        const {username} = ctx.state.user
        let {searchKey} = ctx.query
        if (!searchKey) searchKey = ''
        ctx.body = await userService.getUserList(username, searchKey)
    }
}

adminController.addUser = () => {
    return async (ctx, next) => {
        const {username} = ctx.state.user
        let createUser = await commonService.getCreateUser(username)
        if (createUser) {
            const {username, password, confirm, mobile, status, roleId} = ctx.request.body
            if (password === confirm && roleId) {
                ctx.body = await userService.addUser(createUser, username, password, mobile, status, roleId)
            } else {
                ctx.body = {code: 1, msg: '输入有误'}
            }

        } else {
            ctx.body = {code: 1, msg: '权限错误'}
        }
    }
}

adminController.delUser = () => {
    return async (ctx, next) => {
        const {username} = ctx.state.user
        let createUser = await commonService.getCreateUser(username)
        if (createUser) {
            const {userId} = ctx.query
            if (userId) {
                ctx.body = await userService.delUser(createUser, userId)
            } else {
                ctx.body = {code: 1, msg: '参数有误'}
            }
        } else {
            ctx.body = {code: 1, msg: '权限错误'}
        }
    }
}

adminController.putUserInfo = () => {
    return async (ctx, next) => {
        const {username} = ctx.state.user
        let createUser = await commonService.getCreateUser(username)
        if (createUser) {
            const {userId, username, password, confirm, mobile, status, roleId} = ctx.request.body
            if (userId && username && status && roleId && password === confirm) {
                ctx.body = await userService.putUserInfo(createUser, userId, username, password, mobile, status, roleId)
            } else {
                ctx.body = {code: 1, msg: '参数有误'}
            }
        } else {
            ctx.body = {code: 1, msg: '权限错误'}
        }
    }
}

adminController.getAuth = () => {
    return async (ctx, next) => {
        const {route} = ctx.request.body
        const {id} = ctx.state.user
        const user = await commonService.getUser(id)
        ctx.body = await routeService.getAuth(user, route)
    }
}

adminController.getRole = () => {
    return async (ctx) => {
        let {roleName} = ctx.query
        if (!roleName) roleName = ''
        ctx.body = await roleService.getRole(ctx.user, roleName)
    }
}

adminController.addRole = () => {
    return async (ctx) => {
        const {roleName, remark} = ctx.request.body
        if (roleName) {
            ctx.body = await roleService.addRole(ctx.user, roleName, remark)
        } else {
            ctx.body = {code: 1, msg: '参数有误'}
        }
    }
}

adminController.delRole = () => {
    return async (ctx) => {
        const {roleIds} = ctx.query
        ctx.body = await roleService.delRole(roleIds)
    }
}

adminController.putRole = () => {

}

adminController.saveRoleResources = () => {
    return async (ctx, next) => {
        const {roleId, resourceIds} = ctx.request.body
        const {username} = ctx.state.user
        ctx.body = await roleService.saveRoleResource(username, roleId, resourceIds)
    }
}

adminController.getRoleInfo = () => {
    return async (ctx) => {
        const {roleId} = ctx.query
        ctx.body = await roleService.getRoleInfo(ctx.user, roleId)
    }
}

adminController.getRoute = () => {
    return async (ctx, next) => {
        ctx.body = await routeService.getRoute()
    }
}

module.exports = adminController
