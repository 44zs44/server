module.exports = app => {
    const mongoose = require("mongoose")
    mongoose.connect('mongodb://127.0.0.1:27017/test', {
        //mongoose": "^6.8.2废弃了以下两种写法
        useNewUrlParser: true,
        useUnifiedTopology : true,
    },100000)
}

