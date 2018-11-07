const Router = require('koa-router')
const router = new Router()
const adminController = require('../controller/admin')

router.prefix('/admin')

// 注册
router.post('/register', adminController.register())
// 登录
router.post('/login', adminController.login())

// 角色相关
router.get('/role', adminController.getRole())
router.post('/role', adminController.addRole())
router.delete('/role', adminController.delRole())
router.post('/role/resources', adminController.saveRoleResources())
router.get('/role/resources', adminController.getRoleResources())

router.get('/menu', adminController.getMenu())

// 用户相关
router.get('/user', adminController.getUserList())
router.post('/user', adminController.addUser())
router.get('/user/info', adminController.getUserInfo())
router.put('/user/info', adminController.putUserInfo())

router.post('/route/auth', adminController.getAuth())

module.exports = router
