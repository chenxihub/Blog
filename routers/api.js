/**
 *
 * API路由管理
 * 记住：一定要记得导出模块
 */
let express = require('express');
let router = express.Router();

//引入数据库模型
let User = require('../models/User');
let content = require('../models/Content');

//定义返回值的对象和编码
let responsData;

router.use(function (req, res, next) {
    responsData = {
        code: 0,
        message: ''
    };
    next();
});

/**
 * 用户注册逻辑：
 * 1.用户名不能为空
 * 2.密码不能为空
 * 3.两次密码必须一致
 *
 *
 * 数据库操作
 * 1.用户是否已经注册
 */


router.post('/user/register', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;
    // console.log(req.body);
    if (username == '') {
        responsData.code = 1;
        responsData.message = '用户名不能为空';
        res.json(responsData);
        return;
    }
    if (password == '') {
        responsData.code = 2;
        responsData.message = '密码不能为空';
        res.json(responsData);
        return;
    }
    if (repassword != password) {
        responsData.code = 3;
        responsData.message = '两次密码输入不一致';
        res.json(responsData);
        return;
    }

    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) {
            responsData.code = 4;
            responsData.message = '用户已经被注册了';
            res.json(responsData);
            return;
        }
        let user = new User({
            username: username,
            password: password
        });
        return user.save();

    }).then(function (newUserInfo) {
        console.log(newUserInfo);
        responsData.message = '注册成功';
        res.json(responsData);
        return;
    })
});
//登录API
router.post('/user/login', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    //判断username,password 是否为空
    if (username == '' || password == '') {
        responsData.code = 1;
        responsData.message = '用户名和密码不能为空';
        res.json(responsData);
        return;
    }
    //去查询数据库的用户是否存在
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo) {
            responsData.code = 2;
            responsData.message = '用户名或密码错误';
            res.json(responsData);
            return;
        } else {
            responsData.message = '登录成功';
            responsData.userInfo = {
                _id: userInfo._id,
                username: userInfo.username,

            };
            req.cookies.set('userInfo', JSON.stringify({
                _id: userInfo._id,
                username: userInfo.username,
            }));
            res.json(responsData);
            return;
        }

    })
});
//退出登录
router.get('/user/logout', function (req, res) {
    req.cookies.set('userInfo', null);
    responsData.message = '退出成功';
    res.json(responsData);
    return;
});
//评论
router.get('/comment', function (req, res) {
    let contentId = req.query.contentid || '';
    //查询数据库这篇内容的信息
    content.findOne({
        _id:contentId
    }).then(function (content) {
        responsData.message = '获取评论成功';
        responsData.data = content.conments;
        res.json(responsData);
    });

});
//评论
router.post('/comment', function (req, res) {
    let contentId = req.body.contentid || '';
    let postData = {
            username: req.userInfo.username,
            postTime: new Date(),
            content: req.body.content
        };
    //查询数据库这篇内容的信息
    content.findOne({
        _id:contentId
    }).then(function (content) {
        content.conments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responsData.message = '评论成功';
        responsData.data = newContent;
        res.json(responsData);
    });

});
module.exports = router;