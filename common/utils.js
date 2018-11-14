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

/**
 * 判断一个不重复的数组是否包含另一个
 * @param arr1
 * @param arr2
 * @return {boolean}
 * @constructor
 */
exports.isContained = (arr1, arr2) => {
	if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) return false
	if (arr1.length < arr2.length) return false
	arr2.forEach(item => {
		if (!arr1.includes(item)) return false
	})
	return true
}

/**
 * 对象数组去重
 * @param objArray
 * @return {*}
 */
exports.objArrayDoWeight = (objArray) => {
	let obj = {}
	objArray = objArray.reduce((item, next) => {
		obj[next.id] ? '' : obj[next.id] = true && item.push(next)
		return item
	}, [])
	return objArray
}
