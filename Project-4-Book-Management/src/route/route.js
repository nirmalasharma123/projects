const express=require("express");
const middlwWare=require("../middleware/middleware")
const router=express.Router();
const userController=require("../controller/userController");
const bookController=require("../controller/bookController");
const reviewController=require("../controller/reviewController")

router.post("/register",userController.creatUser);
router.post("/login",userController.loginUser);

router.post("/books",middlwWare.auth,bookController.creatBooks);
router.get("/books",middlwWare.auth,bookController.getBooks);

router.put("/books/:bookId",middlwWare.auth,bookController.updateBook);
router.get("/books/:bookId",middlwWare.auth,bookController.getBookById)

router.delete("/books/:bookId",middlwWare.auth,bookController.deleteParam); 

router.post("/books/:bookId/review",reviewController.creatReview);
router.put("/books/:bookId/review/:reviewId",reviewController.updateReviews);
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview);

router.all('/*',function(req,res){
    res.status(400).send({status:false,message:"Invalid URL"}) 
}) 




module.exports=router;