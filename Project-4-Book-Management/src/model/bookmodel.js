const moment = require("moment");
const mongoose = require("mongoose");
const objectId=mongoose.Schema.Types.ObjectId
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim:true,
      lowercase:true,
      unique: true
    },
    excerpt: {
         type: String,
         trim:true,
         lowercase:true,
        required: true 
      },
    userId: { 
      type: objectId, 
      trim:true,
      required: true,
       ref: "usermodel" },
    ISBN: { 
      type: String,
      trim:true, 
      required: true ,
      unique: true 
  },
    category: {
      type: String,
      trim:true,
      required: true,
    },
    subcategory: {
      type: String,
      trim:true,
      required: true,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    deletedAt: { 
      type: Date 
    },
    isDeleted: {
       type: Boolean, 
       default: false 
      },
    releasedAt: { 
        type: Date,
        required:true
            },
     },
  { timestamps: true }
);

module.exports=mongoose.model('book',bookSchema);
 
