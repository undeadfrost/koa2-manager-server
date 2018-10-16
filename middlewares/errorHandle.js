const errorHandle = (ctx, next) => {
	return next().catch((err) => {
		if (401 === err.status) {
			ctx.status = 401
			ctx.body = {
				error: err.originalError ? err.originalError.message : err.message,
			}
		} else {
			throw err
		}
	})
}

module.exports = errorHandle
