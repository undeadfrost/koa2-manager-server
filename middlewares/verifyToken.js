const jsonwebtoken = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jsonwebtoken.verify)

const verifyToken = () => {
	return async (ctx, next) => {
		const authorization = ctx.header.authorization
		if (authorization) {
			const oldToken = authorization.split(' ')[1]
			await verify(oldToken, 'secret').catch(err => {
				if (err.message === 'jwt expired') {
					const oldPayload = jsonwebtoken.decode(oldToken)
					let hourDifference = (new Date() - err.expiredAt) / (1000 * 60 * 60)
					if (hourDifference < 2) {
						const newPayload = {
							id: oldPayload.id,
							username: oldPayload.username
						}
						const nweToken = jsonwebtoken.sign(newPayload, 'secret', {expiresIn: '30s'})
						ctx.header.authorization = 'Bearer ' + nweToken
					}
				}
			})
		}
		await next()
	}
}

module.exports = verifyToken
