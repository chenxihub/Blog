/*
* 程序入口
* */
//引入express模块
let express = require('express');
//引入模板引擎
let swig = require('swig');
//创建APP应用 => NodeJS Http.createServer();
let app = express();
//加载数据库模块
let mongoose = require('mongoose');

//加载用户URL的POST请求处理
let bodyParse = require('body-parser');

//加载cookies模块
let userCookies = require('cookies');

//应用数据库模型
let User = require('./models/User');

//设置静态文件托管
//当用户访问/public路径的时候，返回给__dirname + '/public'文件目录下的文件
app.use('/public', express.static(__dirname + '/public'));


/*
 * 配置应用模板
 * 定义当前模板所使用的模板引擎
 * 第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
 */
app.engine('html', swig.renderFile);


/*
 *设置模板文件存放目录，第一个参数必须是views，第二个参数是目录
 */
app.set('views', './views');


/*
 *注册所使用的模板引擎，第一个参数必须是view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）一致
 */
app.set('view engine', 'html');

/**
 * 在开发中取消缓存机制
 */
swig.setDefaults({ cache: false });

//bodyparse 设置
app.use(bodyParse.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    req.cookies = new userCookies(req, res);
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //入口就开始判断用户是不是管理员，切记管理员的权限不要放在cookies里面去处理，会比较大的风险
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });

        } catch (e) {
            next();
        }
    } else {
        next();
    }

});
/*
 *按照不同模块来不同文件开发
 * admin 后台模块
 * API 接口模块
 * / 前端模块
 */
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));


mongoose.connect('mongodb://localhost:27018/blog', function (err) {
    if (err) {
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功');
        //监听http服务端口
        app.listen(8081);
    }
});

