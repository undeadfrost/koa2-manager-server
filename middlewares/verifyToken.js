const jsonwebtoken = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jsonwebtoken.verify)

const verifyToken = () => {
	return async (ctx, next) => {
		const token = ctx.header.authorization
		if (token) {
			const payload = await verify(token.split(' ')[1], 'secret')
			ctx.request.user = payload
		}
		await next()
	}
}

module.exports = verifyToken
