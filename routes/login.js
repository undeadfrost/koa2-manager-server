const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx, next) => {
	ctx.body = {
		'ddd': {
			"fff": 'fff'
		}
	}
})

module.exports = router
