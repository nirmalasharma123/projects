const bookModel=require("../model/bookmodel");
const validator=require("../validator/validator");
const valid=require("validator")
const userModel=require("../model/usermodel")
const mongoose=require("mongoose");
const  {isValidObjectId}=require("mongoose");
const moment=require("moment");
const reviewModel=require("../model/reviewModel");

const creatBooks=async function(req,res){
try{
  let data=req.body;
  if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Please provide details"});

  let{title,excerpt,userId,ISBN,category,subcategory,reviews,releasedAt}=data;
  
    
  if(!title||!validator.isValid(title))  return res.status(400).send({status:false,message:"please provide proper title"});
   title=title.trim()
   if(valid.isNumeric(title)) return res.status(400).send({status:false,message:"please put valid title"})

  let findTitle=await bookModel.findOne({title:title});
  if(findTitle) return res.status(400).send({status:false,message:"please put a unique title"});

  
  if(!excerpt||!validator.isValid(excerpt)) return res.status(400).send({status:false,message:"please provide proper excerpt"});


  if(!validator.isValid(userId)) return res.status(400).send({status:false,message:"please provide  proper userId"});
  userId=userId.trim()
  if(!mongoose.isValidObjectId(userId)) return res.status(400).send({status:false,message:"please provide valid userId"});

  const checkUser = await userModel.findById(userId)
  if(!checkUser) return res.status(400).send({status:false,message:"can't find user id"});

  //autherization
  if(userId!==req.token) return res.status(403).send({statustus:false,message:"you are not autherize for this"})


  if(!ISBN||!validator.isValid(ISBN)) return res.status(400).send({status:false,message:"please provide  proper ISBN"});
  if(!validator.isbnValidator(ISBN)) return res.status(400).send({status:false,message:"please provide valid ISBN"});

  const checkisbnNo=await bookModel.findOne({ISBN:ISBN});
  if(checkisbnNo) return res.status(400).send({status:false,message:"ISBN already exsist"});
  
  if(!category||!validator.isValid(category)) return res.status(400).send({ status : false , message : "Category must be present"});
  if(!validator.isValidateName(category) )return res.status(400).send({status:false,message:"please provide a valid category" });
  
  if(!subcategory ||!validator.isValid(subcategory)) return res.status(400).send({ status : false , message : "subategory must be present"});
  if(!validator.isValidateName(subcategory) )return res.status(400).send({status:false,message:"please provide a valid subcategory" });

  if(reviews){
    if(!reviews||typeof reviews!="number")  return res.status(400).send({status:false,message:"please provide proper reviews"})}

   if(!releasedAt||!validator.isValid(releasedAt)) return res.status(400).send({ status : false , message : "releasedAt must be present"});
   releasedAt=releasedAt.trim()
  if(moment(releasedAt).format("YYYY-MM-DD")!=releasedAt) return res.status(400).send({status:false,message:"invalid date format"})
  
   req.body.userId=userId;
   req.body.releasedAt= moment(releasedAt).format("YYYY-MM-DD")
   const books=await bookModel.create(data);

  return res.status(201).send({status:true,data:books})}
  catch(error){

    return res.status(500).send({status:false,message:error.message})

 
  }
};

const getBooks = async function(req,res){
 let data = req.query;
 
  filterData ={ isDeleted:false } 

  const {userId,category,subcategory} = data

  if(userId){
    if(!isValidObjectId(userId)) return res.status(400).send({status:false,message:"please provide valid userId"});
    
       filterData.userId= userId
  }
  if(category){ 
    if(typeof category !="string")return res.status(400).send({ status : false , message : "Category must be in string"})
    if(!validator.isValidateName(category) )return res.status(400).send({status:false,message:"please provide a valid category" });
    filterData.category= category;
  }

  if(subcategory){
    if(typeof subcategory!="string")return res.status(400).send({ status : false , message : "subcategory must be in string"});
    if(!validator.isValidateName(subcategory) )return res.status(400).send({status:false,message:"please provide a valid subcategory" });
    filterData.subcategory= subcategory
  }
  let getDetails = await bookModel.find(filterData).select({_id:1,title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).sort({ title: 1 })

   if(getDetails.length == 0) return res.status(404).send({status:false,message:"No data Found"})
   
  return res.status(200).send({status:true,data:getDetails})


};
const getBookById= async function(req,res){
try{
  let bookId = req.params.bookId;

  if(!mongoose.isValidObjectId(bookId)) return res.status(400).send({status:false,message:"please enter valid bookId"})
  
  let findBook = await bookModel.findOne({_id:bookId,isDeleted:false}).lean()
  
  if(!findBook) return res.status(404).send({message:"no book exist or it is previously deleted"})
  
  let findReview = await reviewModel.find({bookId:bookId,isDeleted:false})
  
  findBook.reviewsData = findReview
  
  return res.status(200).send({status: true, data :findBook})
}catch(error){

  return res.status(500).send({status:false,message:error.message}) 

}
  

  }



const updateBook = async function(req,res){
  try{
     let bookId=req.params.bookId;
    if(!isValidObjectId(bookId)) return res.status(400).send({status:false,message:"please provide valid bookId"});
    let data=req.body;
    
    if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"please provide detail for updation"});
    let final={};
  

    let findBook = await bookModel.findOne({_id:bookId});
    if(!findBook) return res.status(404).send({status:false,message:"book not found"});
    if(findBook.isDeleted==true) return res.status(400).send({status:false,message:"book is already deleted"})
      
///////============ Autherization=======================///////////////////////////////////////////////////////////////////////////////////
    if(findBook.userId!=req.token) return res.status(403).send({statustus:false,message:"you are not autherize for this"})

    if(data.title) {
        data.title=data.title.trim().toLowerCase()
        if( typeof (data.title)!= "string")  return res.status(400).send({status:false,message:"please provide proper title"});
        if(valid.isNumeric(data.title)) return res.status(400).send({status:false,message:"please enter valid title"})
       
         let findTitle= await bookModel.findOne({title:data.title});
         if(findTitle) return res.status(400).send({status:false,message:"please put a unique title"})
           
           if(data.title!="") {final.title=data.title}
         
         }
          
      if(data.excerpt){
         if( typeof (data.excerpt)!="string") return res.status(400).send({status:false,message:"please provide excerpt in string"});
          data.excerpt=data.excerpt.trim()
          if(data.excerpt!=="") final.excerpt=data.excerpt

      }
      if(data.ISBN){
        data.ISBN=data.ISBN.trim()
        if (typeof (data.ISBN)!="string" || data.ISBN== "")  return res.status(400).send({status:false,message:"please proper ISBN"}) 
        if(!validator.isbnValidator(data.ISBN)) return res.status(400).send({status:false,message:"please  valid ISBN"});

        const checkisbnNo = await bookModel.findOne({ISBN:data.ISBN});
         if(checkisbnNo) return res.status(400).send({status:false,message:"ISBN already exsist"})
           final.ISBN=data.ISBN
         ;

      };
      if(data.releasedAt){
        if ( typeof (data.releasedAt)!="string" || data.releasedAt== " ")  return res.status(400).send({status:false,message:"please provide proper releasedAt"});
        data.releasedAt=data.releasedAt.trim()
        if (!validator.isValid(data.releasedAt))return res.status(400).send({status:false,message:"please provide proper realsedAt"});
        if(moment(data.releasedAt).format("YYYY-MM-DD")!=data.releasedAt) return res.status(400).send({status:false,message:"invalid date format"});
         
        final.releasedAt=data.releasedAt

      }

      if(Object.keys(final).length==0) return res.status(400).send({status:false,message:"please provide detail for updation"});

      let newUpdatedBook=  await bookModel.findOneAndUpdate({_id:bookId},final,{new:true});

      return res.status(200).send({status:true,data:newUpdatedBook});


  }
  catch(error){
     return res.status(500).send({status:false,message:error.message})
  }
}

const deleteParam = async function(req, res) {
  try {
      let id = req.params.bookId ;

      if(!isValidObjectId(id)) return res.status(400).send({status:false,message:"please provide valid userId"});

//=================Autherization================================================================
       let findBook = await bookModel.findById(id);
       if (!findBook ) return res.status(400).send({ status: false, message: " no book exsist" })
       if (findBook.isDeleted == true) return res.status(400).send({status:false,message:"book is already deleted"});
       
      if(findBook.userId!=req.token) return res.status(403).send({statustus:false,message:"you are not autherize for this"})
       
       

      
    let bookToDeleate = await bookModel.findOneAndUpdate({_id:findBook._id}, { isDeleted: true, deletedAt: Date.now() }, { new: true });
    let reviweDelet=await reviewModel.findOneAndUpdate({bookId:findBook._id}, { isDeleted: true}, { new: true });
      
      return res.status(200).send({ status: true, message:"book is sucessfully deleted" })
           
  } catch (error) {
    return res.status(500).send({status:false,message:error.message})
} 
}

module.exports={creatBooks,getBooks,updateBook,deleteParam,getBookById};


