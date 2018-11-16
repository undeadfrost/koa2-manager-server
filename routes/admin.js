const Router = require('koa-router')
const router = new Router()
const adminController = require('../controller/admin')
const permissionCheck = require('../middlewares/permissionCheck')

router.prefix('/admin')

// 注册
router.post('/register', adminController.register())
// 登录
router.post('/login', adminController.login())

// 角色相关
router.get('/role', permissionCheck('sys:role:list'), adminController.getRole())
router.post('/role', permissionCheck('sys:role:save'), adminController.addRole())
router.delete('/role', permissionCheck('sys:role:delete'), adminController.delRole())
router.post('/role/resources', permissionCheck('sys:role:menu:'), adminController.saveRoleResources())
router.get('/role/info', permissionCheck('sys:role:info'), adminController.getRoleInfo())

// 导航菜单
router.get('/menu', adminController.getMenu())

// 用户相关
router.get('/user', adminController.getUserList())
router.post('/user', adminController.addUser())
router.delete('/user', adminController.delUser())
router.get('/user/info', adminController.getUserInfo())
router.put('/user/info', adminController.putUserInfo())

// 菜单相关(列表)
router.get('/route', adminController.getRoute())

router.post('/route/auth', adminController.getAuth())

module.exports = router
