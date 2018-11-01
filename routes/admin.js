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
// router.delete('/role', adminController.delRole())
// router.put('/role', adminController.putRole())
router.post('/role/resources', adminController.saveRoleResources())
router.get('/role/resources', adminController.getRoleResources())

router.get('/menu', adminController.getMenu())
router.get('/user', adminController.getUserInfo())

router.post('/route/auth', adminController.getAuth())

module.exports = router
