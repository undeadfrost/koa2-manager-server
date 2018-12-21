const sysUser = require('../models/SysUser')

const requestUser = () => {
	return async (ctx, next) => {
		const {id} = ctx.state.user
		const user = await sysUser.findById(id)
		if (!user) {
			return ctx.body = {code: 1, msg: '无权操作'}
		}
		ctx.user = user
		return next()
	}
}

module.exports = requestUser
