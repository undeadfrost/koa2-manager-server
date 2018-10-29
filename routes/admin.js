const Router = require('koa-router')
const router = new Router()
const {login, getUserInfo, register, getMenu, getAuth} = require('../controller/admin')

router.prefix('/admin')

router.post('/register', register())
router.post('/login', login())
router.get('/menu', getMenu())
router.get('/user', getUserInfo())
router.post('/route/auth', getAuth())

module.exports = router
