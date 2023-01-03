const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    type:{type :String},
    goodsName:{type :String},
    goodsDescription:{type :String},
    goodsImgList:{type:Array},
    goodsPrice:{type :Number},
    goodsPlace:{type :String},
    publishTime:{type :String},
    mobile:{type :Number},
})

module.exports = mongoose.model("Good",schema)