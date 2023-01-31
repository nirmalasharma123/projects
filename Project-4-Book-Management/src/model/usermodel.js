const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        enum:["Mr", "Mrs", "Miss"]
    },
    name: {
        type:String,
        lowercase:true,
         required:true,
         trim:true
        },
    phone: {
        type:String,
        required:true, 
        trim:true,
        unique:true
        
        },
    email: {
        type:String, 
        required:true,
        trim:true, 
        unique:true
        
    } ,
    password: {
        type:String, 
        required:true,
        min:8,
        max:15
    },
    address: {
       street: {type:String},
      city: {type:String},
      pincode: {type:String}
     },
    
    } ,{ timestamps:true});

    module.exports=mongoose.model('usermodel',userSchema);