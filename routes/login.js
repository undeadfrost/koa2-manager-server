const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx, next) => {
	ctx.body = {
		'ddd': 'fff'
	}
})

module.exports = router
