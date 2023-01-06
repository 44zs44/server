const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    username:{type :String},
    mail:{type :String},
    password:{type :String}

})

module.exports = mongoose.model("User",schema)
