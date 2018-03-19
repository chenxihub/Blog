/**
 * 设计表结构，定义数据字段，连接数据库
 */
let mongoose = require('mongoose');

//内容的表结构

module.exports = new mongoose.Schema({
    //添加引用表结构 -> categroy.id ->populate()方法调用的就是这里的categroy字段头
    categroy: {
        type: mongoose.Schema.Types.ObjectId,
        //引用关联表结构模型
        ref: 'Categroy'
    },
    //title
    title: String,
    //简介
    description: {
        type: String,
        default: ''
    },
    //内容
    content: {
        type: String,
        default: ''
    }
});