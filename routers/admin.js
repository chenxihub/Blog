/**
 *
 * 后台路由管理
 * 记住：一定要记得导出模块
 */
let express = require('express');
let router = express.Router();

router.get('/user',function (req,res,next) {
   res.send('<h1>这是用户</h1>')
});

module.exports = router;