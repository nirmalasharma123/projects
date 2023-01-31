const moment = require("moment");
const mongoose = require("mongoose");
var now = moment();
const objectId = mongoose.Schema.Types.ObjectId;

const reviewSchema=new mongoose.Schema({
bookId:{
    type:objectId,
     ref:"book",
     trim:true,
     required:true
   
},
reviewedBy:{
    type:String,
    default:'guest',
    trim:true,
    required:true

},
reviewedAt:{
    type:Date,
    required:true
},
rating:{
    type:Number,
    minlength:1,
    maxlength:5,
    required:true

},
isDeleted:{
    type:Boolean,
    default:false
},
review:{
    type:String,
    trim:true
}

});
module.exports=mongoose.model('reviews',reviewSchema)




// bookId: {ObjectId, mandatory, refs to book model},
//   reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
//   reviewedAt: {Date, mandatory},
//   rating: {number, min 1, max 5, mandatory},
//   review: {string, optional}
//   isDeleted: {boolean, default: false},
// }