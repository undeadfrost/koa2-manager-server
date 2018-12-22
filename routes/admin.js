const Router = require('koa-router')
const router = new Router()
const adminController = require('../controller/admin')
const permissionCheck = require('../middlewares/permissionCheck')
const requestUser = require('../middlewares/requestUser')

router.prefix('/admin')

// 注册
router.post('/register', adminController.register())
// 登录
router.post('/login', adminController.login())

// 角色相关
router.get('/role', permissionCheck('sys:role:list'), adminController.getRole())
router.post('/role', permissionCheck('sys:role:save'), adminController.addRole())
router.delete('/role', permissionCheck('sys:role:delete'), adminController.delRole())
router.post('/role/info', permissionCheck('sys:role:save'), adminController.saveRoleInfo())
router.get('/role/info', permissionCheck('sys:role:info'), adminController.getRoleInfo())

// 导航菜单
router.get('/nav', adminController.getMenu())

// 用户相关
router.get('/user', permissionCheck('sys:user:list'), adminController.getUserList())
router.post('/user', permissionCheck('sys:user:save'), adminController.addUser())
router.delete('/user', permissionCheck('sys:user:delete'), adminController.delUser())
router.get('/user/info', permissionCheck('sys:user:info'), adminController.getUserInfo())
router.put('/user/info', permissionCheck('sys:user:update'), adminController.putUserInfo())

// 菜单相关(列表)
router.get('/menu', permissionCheck('sys:menu:list'), adminController.getRoute())
router.post('/menu', permissionCheck('sys:menu:save'), adminController.addRoute())
router.delete('/menu', permissionCheck('sys:menu:delete'), adminController.delRoute())
router.get('/menu/info', permissionCheck('sys:menu:info'), adminController.getRouteInfo())
router.put('/menu/info', permissionCheck('sys:menu:update'), adminController.putRouteInfo())

// 个人信息修改
router.put('/my/basic', requestUser(), adminController.putMyBasic())
router.post('/my/upload/head', requestUser(), adminController.uploadHead())
router.put('/my/security', requestUser(), adminController.putMySecurity())
// 路由权鉴
router.post('/route/auth', adminController.getAuth())

module.exports = router
