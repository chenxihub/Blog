/**
 * 通过构造函数来操作数据库
 */
let mongoose = require('mongoose');

let categroySchema = require('../schemas/categroies');
/**
 * 创建数据模型
 */
module.exports = mongoose.model('Categroy', categroySchema);