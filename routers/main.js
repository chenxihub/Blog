/**
 *
 * 前端路由管理
 * 记住：一定要记得导出模块
 */
let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
    console.log(req.userInfo);
    res.render('main/index', {
        userInfo: req.userInfo
    });
});

module.exports = router;