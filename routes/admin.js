const Router = require('koa-router')
const router = new Router()
const {login, getUserInfo, register, getMenu} = require('../controller/admin')

router.prefix('/admin')

router.post('/register', register())
router.post('/login', login())
router.get('/menu', getMenu())
router.get('/user', getUserInfo())

module.exports = router
