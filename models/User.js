/**
 * 通过构造函数来操作数据库
 */
let mongoose = require('mongoose');

let usersSchema = require('../schemas/users');
/**
 * 创建数据模型
 */
module.exports = mongoose.model('User', usersSchema);