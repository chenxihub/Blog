/**
 * 设计表结构，定义数据字段，连接数据库
 */
let mongoose = require('mongoose');

//用户的表结构

module.exports = new mongoose.Schema({
    name: String,
});