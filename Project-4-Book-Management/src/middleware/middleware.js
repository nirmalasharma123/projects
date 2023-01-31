const jwt=require("jsonwebtoken");

const auth=async function(req,res,next){
   try{ let token =req.headers["x-api-key"];
   
    if(!token) return res.status(404).send({status:false,message:"token must be present"});

   let verifyToken= jwt.verify(token,"group10project",function (error,decodedToken){
    if(error){
      if(error.name=="TokenExpiredError") return res.status(400).send({status:false,message:"token is expired"})
      else if(error.name=="jasonWebToken") return res.status(404).send({status:false,message:"invalid token"})
      else return res.send({status:false,message:error.message})
    }

    req.token=decodedToken.userId

    next()
   })
   }

   catch(error){
    return res.status(500).send({status:false,message:error.message})

   }
};


module.exports={auth};