const bookModel=require("../model/bookmodel")
const validator = require("../validator/validator");
const  {isValidObjectId}=require("mongoose");
const reviewModel = require("../model/reviewModel");
const bookmodel = require("../model/bookmodel");

const creatReview=async function(req,res){
   try{

    if(!req.body.bookId) {req.body.bookId=req.params.bookId}
    if(!req.body.reviewedAt) {req.body.reviewedAt= Date.now()}
   
    let bookID=req.params.bookId;
    if(!isValidObjectId(bookID)) return res.status(400).send({status:false,message:"please provide valid bookId"});


    let findId=await bookModel.findOne({_id:bookID});
    if(!findId) return res.status(404).send({status:false,message:"book not found"})
    if(findId.isDeleted==true) return res.status(400).send({status:false,message:"book already deleted"});


     let data=req.body
    
    let {review, rating, reviewedBy}=data;
  
    if(reviewedBy){
         if( typeof reviewedBy!="string" || reviewedBy == "")  return res.status(400).send({status:false,message:"please provide proper reviwed by"});
         if(!validator.isValidateName(reviewedBy) )return res.status(400).send({status:false,message:"please provide a valid name" })
    };
 
    if(!rating||typeof rating!="number")  return res.status(400).send({status:false,message:"please provide proper rating"});
    if(rating<1|| rating>5) return res.status(400).send({status:false,message:"please provide rating between 1 to 5"});
    
  
    if(review){
        if(typeof review !="string"|| review=="") return res.status(400).send({status:false,message:"please provide proper review"})

    }; 

    
    let updateReviews=await bookModel.findOneAndUpdate({_id:bookID,isDeleted:false},{$inc:{reviews:1}},{new:true}).lean();
    let reviewDetails=await reviewModel.create(data);
    
     updateReviews.reviewData=reviewDetails;

    return res.status(201).send({status:true,data:updateReviews})}
     catch (error) {
      return res.status(500).send({status:false,message:error.message})
      }

};

const updateReviews=async function (req,res){
   try{ let bookId=req.params.bookId;
    let reviewId=req.params.reviewId;

    if(!isValidObjectId(bookId)) return res.status(400).send({status:false,message:"please provide valid bookId"});
    if(!isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"please provide valid review id"});

     let findBookId=await bookModel.findOne({_id:bookId}).lean()
     if(!findBookId)  return res.status(400).send({status:false,message:"book didn't exsist"});
     if(findBookId.isDeleted==true) return res.status(400).send({status:false,message:"book is already deleted"});

     let findReviewId=await reviewModel.findOne({_id:reviewId});
     if(!findReviewId)return res.status(404).send({status:false,message:"review not found"});
     if(findReviewId.isDeleted==true) return res.status(400).send({status:false,message:"book is already deleted"});

     if(Object.keys(req.body).length==0) return res.status(400).send({status:false,message:"please provide details"})

    let data=req.body
    let {review, rating,reviewedBy } = data;
     let final={}
    
    if(review){
        if(typeof review !="string"|| review=="") return res.status(400).send({status:false,message:"please provide proper review"});
        if(review !="") final.review=review
        
        
   }
   if(rating){
    if(typeof rating!="number"||rating=="")  return res.status(400).send({status:false,message:"please provide proper rating"});
    if(rating<1|| rating>5) return res.status(400).send({status:false,message:"please provide rating between 1 to 5"});
    if(rating !="") final.rating=rating
    
   }
  if(reviewedBy){
    reviewedBy=reviewedBy.trim()
    if( typeof reviewedBy!="string" || reviewedBy == "")  return res.status(400).send({status:false,message:"please provide proper reviwed by"});
    if(!validator.isValidateName(reviewedBy) )return res.status(400).send({status:false,message:"please provide a valid name" })
    if(reviewedBy !="") final.reviewedBy=reviewedBy
    
  }
    if(Object.keys(final).length==0)  return res.status(400).send({status:false,message:"please provide details"})
    let findReview= await reviewModel.findOneAndUpdate({_id:reviewId,isDeleted:false},final,{new:true});
    
    findBookId.reviewData=findReview
  return res.status(200).send({status:true,data:findBookId})}
  catch (error) {
    return res.status(500).send({status:false,message:error.message})
  }


};
const deleteReview = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        const reviewId = req.params.reviewId

        if(!isValidObjectId(bookId)) return res.status(400).send({status:false,message:"please provide valid book Id"});
        if(!isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"please provide valid review Id"});

        const searchBook = await bookModel.findOne({ _id: bookId});
        if (!searchBook) return res.status(404).send({ status: false, message: `Book does not exist by this ${bookId}.` })
        if(searchBook.isDeleted===true) return res.status(400).send({status:false,message:"book already deleted"})
        
        const searchReview = await reviewModel.findOne({ _id:reviewId})
        if (!searchReview)  return res.status(404).send({ status: false, message: `Review does not exist by this ${reviewId}.` })
        if(searchReview.isDeleted===true) return res.status(400).send({status:false,message:"Review already deleted"})
        
      const deleteReviewDetails = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true, deletedAt: Date.now() }, {new: true })
        await bookModel.findOneAndUpdate({ _id: bookId },{$inc:{ reviews: -1 }})
                
            return res.status(200).send({ status: true, message: "Review deleted successfully."})

                   }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

module.exports={creatReview,updateReviews,deleteReview}
