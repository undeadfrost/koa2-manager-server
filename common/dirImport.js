const fs = require('fs')

/**
 * 加载所属目录下所有路由
 * @param app
 * @param path
 */
const routes = (app, path) => {
	let files = fs.readdirSync(path)
	let js_files = files.filter(file => {
		return file.endsWith('.js')
	})
	js_files.forEach(file => {
		let routerJs = require(path + file)
		app.use(routerJs.routes(), routerJs.allowedMethods())
		console.log(`import route ${file}...`)
	})
}

module.exports = {
	routes
}
