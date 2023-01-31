const express=require('express')
const route=require('./route/route')
const {default:mongoose}=require('mongoose');
mongoose.set("strictQuery",true)
const app=express()

app.use(express.json())

mongoose.connect("mongodb+srv://nishant55:1234@nishant99.et97kst.mongodb.net/group10Databases", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )



app.use('/',route)
app.listen(3000,function(){

    console.log('express is running on port 3000')
});