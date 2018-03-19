/**
 *
 * 前端路由管理
 * 记住：一定要记得导出模块
 */
let express = require('express');
let router = express.Router();
//引入分类数据模型
let categroy = require('../models/Categroy');
//引入内容数据模型
let content = require('../models/Content');

let data;
//处理通用数据
router.use(function (req, res, next) {
    data = {
        categroies: [],
        userInfo: req.userInfo,
    };
    categroy.find().then(function (categroies) {
        data.categroies = categroies;
        next();
    })
});

router.get('/', function (req, res, next) {
    //返回给模板的数据包装成对象
    data.categroy = req.query.categroy || '';
    data.page = Number(req.query.page || 1);
    data.count = 0;
    data.limit = 5;
    data.pages = 0;
    let where = {};
    if (data.categroy) {
        where.categroy = data.categroy
    }
    content.count().then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page, data.pages);
        //取值不能小于1
        data.page = Math.max(data.page, 1);
        //限定忽略的条数
        let skip = (data.page - 1) * data.limit;

        return content.where(where).find().sort({ _id: -1 }).limit(data.limit).skip(skip).populate(['categroy', 'user']).sort({
            addTime: -1
        })
    }).then(function (contents) {
        data.contents = contents;
        // console.log(data);
        res.render('main/index', data);
    });
});

//详情页模板
router.get('/view', function (req, res) {
    let contentId = req.query.contentId;
    content.findOne({
        _id: contentId
    }).populate(['categroy', 'user']).then(function (content) {
        //存储点击量
        content.views++;
        content.save();
        data.contents = content;
        res.render('main/view', data)
    });
});
module.exports = router;