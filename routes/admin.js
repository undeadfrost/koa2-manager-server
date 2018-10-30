const Router = require('koa-router')
const router = new Router()
const {login, getUserInfo, register, getMenu, getAuth, getRole} = require('../controller/admin')

router.prefix('/admin')

router.post('/register', register())
router.post('/login', login())
router.get('/menu', getMenu())
router.get('/user', getUserInfo())
router.get('/role', getRole())
router.post('/route/auth', getAuth())

module.exports = router
