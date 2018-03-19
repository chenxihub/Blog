/**
 *
 * 前端路由管理
 * 记住：一定要记得导出模块
 */
let express = require('express');
let router = express.Router();
//引入分类数据模型
let categroy = require('../models/Categroy');

router.get('/', function (req, res, next) {
    console.log("req:" + req.userInfo);
    categroy.find().then(function (categroies) {
        console.log("result:" + categroies);
        res.render('main/index', {
            userInfo: req.userInfo,
            categroies: categroies
        });
    });

});

module.exports = router;