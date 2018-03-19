/**
 *
 * 后台路由管理
 * 记住：一定要记得导出模块
 */
let express = require('express');
let router = express.Router();
//引入数据库模型，查询数据库注册用户
let user = require('../models/User');
//引入分类数据模型
let categroy = require('../models/Categroy');
//引入内容数据模型
let content = require('../models/Content');
//判断是不是管理员用户
router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('对不起，你不是管理员！');
        return;
    }
    next();
});

router.get('/', function (req, res, next) {
    // console.log(req.userInfo);
    res.render('admin/index', {
        userInfo: req.userInfo
    })
});
/**
 * 用户登录入口
 */
router.get('/user', function (req, res, next) {
    let page = Number(req.query.page || 1);
    let limit = 5;
    let pages = 0;
    user.count().then(function (count) {
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        //限定忽略的条数
        let skip = (page - 1) * limit;
        //查询数据库注册用户
        user.find().sort({ _id: -1 }).limit(limit).skip(skip).then(function (user) {
            res.render('admin/cusManage', {
                userInfo: req.userInfo,
                user: user,
                page: page,
                pages: pages,
                count: count,
                limit: limit,
                pageUrl: 'user'
            })
        });
    });
});

//分类首页
router.get('/categroy', function (req, res, next) {
    let page = Number(req.query.page || 1);
    let limit = 5;
    let pages = 0;
    categroy.count().then(function (count) {
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        //限定忽略的条数
        let skip = (page - 1) * limit;
        //查询数据库注册用户
        categroy.find().sort({ _id: -1 }).limit(limit).skip(skip).then(function (categroies) {
            res.render('admin/categroy', {
                userInfo: req.userInfo,
                categroies: categroies,
                page: page,
                pages: pages,
                count: count,
                limit: limit,
                pageUrl: 'categroy'
            })
        });
    });
});
//分类的添加 get
router.get('/categroy/add', function (req, res, next) {
    res.render('admin/categroy_add', {
        userInfo: req.userInfo
    });
});
//添加分类 post
router.post('/categroy/add', function (req, res, next) {
    let name = req.body.name || '';
    console.log('name:' + name);
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '分类名不能为空',
        });
        return;
    }
    //再查询数据库中是否存在此分类
    categroy.findOne({
        name: name
    }).then(function (result) {
        if (result) {
            //数据库中已经存在此分类
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类标签已经存在'
            });
            return Promise.reject();
        } else {
            //标签不存在，可以保存
            return new categroy({
                name: name
            }).save();
        }
    }).then(function (newResult) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类标签保存成功',
            url: '/admin/categroy'
        })
    })
});

//修改分类
router.get('/categroy/edit', function (req, res) {
    let id = req.query.id;
    // console.log(id);
    categroy.findOne({
        _id: id
    }).then(function (categroy) {
        if (!categroy) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            })
            return Promise.reject();
        } else {
            res.render('admin/categroy_edit', {
                userInfo: req.userInfo,
                categroy: categroy
            })
        }
    })
});

//修改编辑分类
router.post('/categroy/edit', function (req, res) {
    let id = req.query.id || '';
    let name = req.body.name || '';
    categroy.findOne({
        _id: id
    }).then(function (result) {
        if (!result) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            })
            return Promise.reject();
        } else {
            //如果用户没有修改，直接保存
            if (name == result.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/categroy'
                })
                return Promise.reject();
            } else {
                //用户修改的分类数据库中已经存在
                return categroy.findOne({
                    _id: { $ne: id },
                    name: name
                })
            }
        }
    }).then(function (sameCategroy) {
        if (sameCategroy) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息已经存在'
            })
            return Promise.reject();
        } else {
            return categroy.update({
                _id: id
            }, {
                name: name
            })
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/categroy'
        })
    })
});
//分类的删除
router.get('/categroy/delete', function (req, res) {
    let id = req.query.id || '';
    categroy.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/categroy'
        })
    })
});

/**
 * 内容首页
 */
router.get('/content', function (req, res, next) {
    let page = Number(req.query.page || 1);
    let limit = 5;
    let pages = 0;
    content.count().then(function (count) {
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        //限定忽略的条数
        let skip = (page - 1) * limit;
        /**
         * 查询数据库注册用户
         * populate('categroy') 查询关联表结构
         */
        content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate('categroy').then(function (contents) {
            // console.log(contents);
            res.render('admin/content', {
                userInfo: req.userInfo,
                contents: contents,
                page: page,
                pages: pages,
                count: count,
                limit: limit,
                pageUrl: 'content'
            })
        });
    });
});
/**
 * 内容的添加 下拉选择的分类从数据库中获取
 */
router.get('/content/add', function (req, res, next) {
    categroy.find().sort({ _id: -1 }).then(function (categroies) {
        // console.log(categroies);
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categroies: categroies
        })
    })
});

/**
 * 内容的保存 按钮的触发
 */
router.post('/content/add', function (req, res, next) {
    // console.log(req.body);
    if (req.body.categroy == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    new content({
        categroy: req.body.categroy,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).save().then(function (rs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '添加内容成功',
            url: '/admin/content'
        })
    });
})

/**
 * 内容的修改
 */
router.get('/content/edit', function (req, res) {
    let id = req.query.id;
    let categroies = [];
    categroy.find().sort({ _id: -1 }).then(function (rs) {
        categroies = rs;
        return content.findOne({ _id: id }).populate('categroy');
    }).then(function (content) {
        // console.log(content);
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '内容标题不能为空'
            })
            return Promise.reject();
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                content: content,
                categroies: categroies
            })
        }
    })

});
router.post('/content/edit', function (req, res) {
    let id = req.query.id;
    if (req.body.categroy == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }

    content.update({
        _id: id
    }, {
        categroy: req.body.categroy,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function (rs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '保存内容成功',
            url: '/admin/content/edit?id=' + id
        })
    })
})
module.exports = router;