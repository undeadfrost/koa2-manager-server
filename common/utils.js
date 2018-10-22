const crypto = require('crypto')

/**
 * 生成当前时间时间戳
 * @return {number}
 */
exports.getTimstamp = () => {
	return Date.parse(new Date()) / 1000
}

/**
 * jwt secret生成
 * @param username
 * @param timstamp
 * @return {string}
 */
exports.generateSecret = (username, timstamp) => {
	// 获取随机数
	const nonce = Math.floor(Math.random() * 99999)
	// 字典排序
	const arr = [username, timstamp, nonce].sort()
	// 加密
	const sha1 = crypto.createHash('sha1').update(arr.join(''))
	return sha1.digest('hex')
}
