const Category = require("../../models/Category");
const Good = require("../../models/Good");

const urlLib = require('url')
const multer=require('multer')
const upload=multer({dest:__dirname+'/../../uploads'})
module.exports = app => {
    const express = require('express');
    const router = express.Router();
    //导入分类模型
    const Category = require('../../models/Category')
    const Good = require("../../models/Good");



//接口
    /*新增分类接口*/
    router.post('/addCategories', async (req, res) => {
        console.log("新增分类post接口接收数据====>" + JSON.stringify(req.body))
        if (await Category.findOne(req.body)) {
            console.log("查询到重复数据，返回重复数据")
            res.send({message:'添加的数据为已经存在的数据'})
        } else {
            console.log("没有查询到重复数据，插入一条数据")
            const model = await Category.create(req.body)
            res.send(model)
        }
    })


    /*新增获取分类接口*/
    router.get('/getCategories', async (req, res) => {
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

    })

    /*删除一条分类接口*/
    router.post('/deleteCategories', async (req, res) => {
        console.log("进入删除接口")
        console.log(JSON.stringify(req.body))
        if (req.body!=={}){
            const model = await Category.findByIdAndDelete(req.body.id)
            res.send(model)
        }else {
            res.send({message:'无传递数据'})
        }

    })


    /*上传图片接口*/
    router.post('/upload',upload.single('file'), async (req, res) => {
        const file=req.file
        file.url=`http://localhost:3000/uploads/${file.filename}`
        console.log(file.url)
        res.send(file)
    })


//物品接口
    /*新增物品接口*/
    router.post('/addGoods', async (req, res) => {
        console.log("新增物品post接口接收数据====>" + JSON.stringify(req.body))
        if (req.body._id) {
            console.log("修改数据==>")
            const model = await Good.findByIdAndUpdate(req.body._id,req.body)
            res.send(model)
        } else {
            console.log("没有查询到重复数据，插入一条数据")
            const model = await Good.create(req.body)
            res.send(model)
        }
    })
    /*新获取物品接口*/
    router.get('/getGoodsList', async (req, res) => {
        let params = urlLib.parse(req.url, true);
        //有传参
        if (params.query.id) {
            console.log("获取物品get接口有传参数,===>" + JSON.stringify(params.query))
            //通过id查找数据
            const model = await Good.findById(params.query.id)
            res.send(model)
        } else {//无传参
            console.log("获取物品get接口无传参数")
            //返回所有数据
            const model = await Good.find()
            res.send(model)
        }
    })

    /*删除一条物品接口*/
    router.post('/deleteGood', async (req, res) => {
        console.log("进入删除物品接口==>")
        console.log(JSON.stringify(req.body))
        if (req.body!=={}){
            const model = await Good.findByIdAndDelete(req.body.id)
            res.send(model)
        }else {
            res.send({message:'无传递数据'})
        }

    })













    app.use('/admin/api', router)
}




