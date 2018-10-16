const Koa = require('koa2')
const bodyParser = require('koa-bodyparser')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const json = require('koa-json')
const jwt = require('koa-jwt')

const dirImport = require('./common/dirImport')
const config = require('./config/default')
const errorHandle = require('./middlewares/errorHandle')

const app = new Koa()

// 完善页面错误提示
onerror(app)
app.use(errorHandle)
app.use(jwt({secret: 'secret'}).unless({
	path: [
		/^\/admin\/login/,
		/^\/admin\/register/,
	]
}))
app.use(bodyParser())
app.use(logger())
app.use(json())
app.use(require('koa-static')(__dirname + '/static'))

// 自动加载routers下路由文件
dirImport.routes(app, __dirname + '/routes/')

// 错误处理
app.on('error', (err, ctx) => {
	console.log(new Date() + '  server error', err)
})

// 启动
app.listen(config.port)
console.log(`app started at port ${config.port}...`)
