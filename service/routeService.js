const SysUser = require('../models/SysUser')
const SysMenu = require('../models/SysMenu')
const {objArrayDoWeight, menusOrder} = require('../common/utils')

let routeService = {}

routeService.getMenu = async (user) => {
    let SysMenuList = []
    try {
        let roles = await user.getSys_roles()
        for (let i = 0; i < roles.length; i++) {
            let menus = await roles[i].getSys_menus()
            menus.forEach(menu => {
                SysMenuList.push(menu)
            })
        }
    } catch (e) {
        console.log(e)
        return []
    }
    SysMenuList = menusOrder(objArrayDoWeight(SysMenuList))
    let permissions = []
    let navList = []
    SysMenuList.forEach(SysMenu => {
        delete SysMenu.dataValues.sys_role_menu
        if (SysMenu.type === 1) permissions.push(SysMenu.permission)
        delete SysMenu.dataValues.permission
        if (SysMenu.parent === 0) navList.push(SysMenu)
    })
    navList.forEach(item => {
        if (item.type === 0) {
            item.setDataValue('submenus', SysMenuList.filter(SysMenu => {
                return SysMenu.type !== 2 && item.id === SysMenu.parent
            }))
        }
    })
    return {navList: navList, permissions: permissions}
}

routeService.getAuth = async (user, route) => {
    let isAuth = false
    try {
        let roles = await user.getSys_roles()
        for (let i = 0; i < roles.length; i++) {
            let menus = await roles[i].getSys_menus({where: {route: route}})
            if (menus.length === 1) {
                isAuth = true
                break
            }
        }
    } catch (e) {
        console.log(e)
        return {'isAuth': isAuth, msg: '参数有误'}
    }
    if (isAuth) {
        return {'isAuth': true}
    } else {
        return {'isAuth': false, msg: '此账户无访问权限'}
    }
}

routeService.getRoute = async (createUser, routeName) => {
    const menuList = await SysMenu.findAll()
    return menuList
}

module.exports = routeService
