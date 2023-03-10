const express=require("express");
const app=express();
app.use(require('cors')())
app.use(express.json())

app.use('/uploads',express.static(__dirname+'/uploads'))
// app.use(express.static(__dirname+'/uploads'))
require("./routes/admin")(app)
require("./routes/web")(app)
require("./plugins/db")(app)



app.listen(3000,()=>{
    console.log("监听http://location:3000");
})
