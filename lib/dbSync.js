const sequelize = require('./mysql')
const User = require('../models/user')
const Role = require('../models/role')
const Permission = require('../models/permission')


// 同步所有尚未在数据库中的模型
// sequelize.sync()

// 强制同步所有模型
sequelize.sync({force: true})
