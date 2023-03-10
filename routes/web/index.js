const urlLib = require('url')
const multer = require('multer')
const upload = multer({dest: __dirname + '/../../uploads'})
module.exports = app => {
    const express = require('express');
    const router = express.Router();
    //导入分类模型
    const Category = require('../../models/Category')
    const Good = require("../../models/Good");
    const Admin = require("../../models/Admin");
    const User = require("../../models/User");


//接口
    /*新增分类接口*/
    router.post('/addCategories', async (req, res) => {
        console.log("进入新增分类接口,接收数据====>" + JSON.stringify(req.body))
        if (await Category.findOne(req.body)) {
            console.log("查询到重复数据，返回重复数据")
            res.send({message: '添加的数据为已经存在的数据'})
        } else {
            console.log("没有查询到重复数据，插入一条数据")
            const model = await Category.create(req.body)
            res.send(model)
        }
        console.log("<===退出新增分类接口接收数据")
    })


    /*获取分类接口*/
    router.get('/getCategories', async (req, res) => {
        console.log("进入获取分类接口===>")
        console.log(req)
        console.log(req.headers.token)
        let params = urlLib.parse(req.url, true);
        //有传参
        if (params.query.id) {
            console.log("获取分类get接口有传参数,===>" + JSON.stringify(params.query))
            //通过id查找数据
            const model = await Category.findById(params.query.id)
            res.send(model)
        } else {//无传参
            console.log("获取分类get接口无传参数")
            //返回所有数据
            const model = await Category.find()
            res.send(model)
        }
        console.log("<===退出获取分类接口")
    })

    /*删除一条分类接口*/
    router.post('/deleteCategories', async (req, res) => {
        console.log("进入删除分类接口===>")
        console.log(JSON.stringify(req.body))
        if (req.body !== {}) {
            const model = await Category.findByIdAndDelete(req.body.id)
            res.send(model)
        } else {
            res.send({message: '无传递数据'})
        }
        console.log("<====退出删除分类接口")
    })


    /*上传图片接口*/
    router.post('/upload', upload.single('file'), async (req, res) => {
        console.log("进入上传图片接口===>")
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        console.log(file.url)
        res.send(file)
        console.log("<===退出上传图片接口")
    })


//物品接口
    /*新增物品接口*/
    router.post('/addGoods', async (req, res) => {
        console.log("进入新增物品接口,接收数据====>" + JSON.stringify(req.body))
        if (req.body._id) {
            console.log("修改数据==>")
            const model = await Good.findByIdAndUpdate(req.body._id, req.body)
            res.send(model)
        } else {
            console.log("没有查询到重复数据，插入一条数据")
            const model = await Good.create({...req.body,publisher:req.headers.token})
            res.send(model)
        }
        console.log("<===退出新增物品接口")
    })

    /*获取物品接口*/
    router.get('/getGoodsList', async (req, res) => {
        console.log("进入获取物品接口====>")
        let params = urlLib.parse(req.url, true);
        console.log(params.query)
        if (JSON.stringify(params.query) === '{}') {
            const model = await Good.find()
            res.send(model)
        } else {
            if (params.query.id === undefined) {//列表数据模糊查询
                //多条件查询
                const model = await Good.find({
                        $and: [
                            {type: {$regex: params.query.type}},
                            {goodsName: {$regex: params.query.goodsNameSearch}},
                            {goodsDescription: {$regex: params.query.goodsDescription}},
                        ]
                    }
                )
                res.send(model)
            } else {//编辑数据查询单数据
                const model = await Good.findById(params.query.id)
                res.send(model)
            }
        }
        console.log("<===退出获取物品接口")
    })


    /*删除一条物品接口*/
    router.post('/deleteGood', async (req, res) => {
        console.log("进入删除物品接口==>")
        console.log(JSON.stringify(req.body))
        if (req.body !== {}) {
            const model = await Good.findByIdAndDelete(req.body.id)
            res.send(model)
        } else {
            res.send({message: '无传递数据'})
        }
        console.log("<===退出删除物品接口")
    })

    //登录接口
    router.post('/user/login', async (req, res) => {
        console.log("进入login接口==>")
        console.log(req.body)
        if (await Admin.findOne(req.body)){
            res.send({token: req.body.username})
        }else {
            res.send({message: '账号或者密码错误！！！'})
        }

        console.log("<===退出login接口")
    })

    //获取信息
    router.get('/user/info', async (req, res) => {
        console.log("进入info接口==>")
        let params = urlLib.parse(req.url, true);
        res.send({
            avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            name: "二哈",
            role: ["admin"],
            introduction: "I am a super administrator",
        })
        console.log("<===退出info接口")
    })
    //退出
    router.post('/user/logout', async (req, res) => {
        console.log("进入login接口==>")
        res.send('success')
        console.log("<===退出login接口")
    })




    app.use('/web/api', router)
}


//单体条件模糊查询
/*        if (JSON.stringify(params.query) !== '{}') {
            console.log("获取物品get接口有传参数,===>" + JSON.stringify(params.query))
            //通过id查找数据
            if (params.query.id !== undefined) {
                const model = await Good.findById(params.query.id)
                res.send(model)
            } else if (params.query.goodsNameSearch !== undefined) {
                //模糊查询
                const model = await Good.find({goodsName: {$regex:params.query.goodsNameSearch}})
                res.send(model)
            } else if (params.query.goodsDescription !== undefined) {
                //模糊查询
                const model = await Good.find({goodsDescription: {$regex:params.query.goodsDescription}})
                res.send(model)
            }else if (params.query.type !== undefined) {
                if (params.query.type!==""){
                    //模糊查询
                    const model = await Good.find({type: params.query.type})
                    res.send(model)
                }else {
                    const model = await Good.find()
                    res.send(model)
                }
            }else {
                res.send({message: "传参错误！！！"})
            }
        } else {//无传参
            console.log("获取物品get接口无传参数")
            //返回所有数据
            const model = await Good.find()
            res.send(model)
        }*/


