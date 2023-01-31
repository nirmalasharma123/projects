const userModel=require("../model/usermodel");
const jwt=require("jsonwebtoken");
const validator=require("../validator/validator");
const valid=require("validator");

const creatUser= async function(req,res){

    try {
        let data=req.body;
        if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Please provide details"});
        
    let {title,name,phone,email,password,address}=data;

    
    if(!title) return res.status(400).send({status:false,message:"please  title is mendatory"});
     title=title.trim()
    if( !validator.isValid(title)) return res.status(400).send({status:false,message:"please provide Proper title"});
    if(!(["Mr", "Mrs", "Miss"].includes(title))) return res.status(400).send({status:false,message:"please provide valid title  like Mr,Miss,Mrs"});

    if(!name || !validator.isValid(name)) return res.status(400).send({status:false,message:"please provide Proper name"});
    if(!validator.isValidateName(name) )return res.status(400).send({status:false,message:"please provide a valid format of name" });
      
    if(!phone || !validator.isValid(phone)) return res.status(400).send({status:false,message:"please provide phone no"});
    phone=phone.trim()
    if(!validator.isValidMobile(phone)) return res.status(400).send({status:false,message:"please provide Proper phone no must be 10 digit"});
    
    if(!email) return res.status(400).send({status:false,message:"please provide email "});
    email=email.trim()
    if( !validator.isValid(email)) return res.status(400).send({status:false,message:"please provide Proper email"});
    if(!valid.isEmail(email))  return res.status(400).send({status:false,message:"please provide Valid email"});
    
    let findNumber= await userModel.findOne({phone:phone});
    if(findNumber) return res.status(400).send({status:false,message:"phone no already present"});

    let findEmail=await userModel.findOne({email:email})
    if(findEmail) return res.status(400).send({status:false,message:"email already present"});

    if(!password) return res.status(400).send({status:false,message:"password is mendatory"});
    if( !validator.isValid(password)) return res.status(400).send({status:false,message:"please provide Proper password"});
    if(!validator.isValidPassword(password)) return res.status(400).send({status:false,message:"password should be minimum 8 letters and max 15 letter and should conatin one special character"});
     
    if(address) {
        if(typeof address!="undefined"){
            if(address.street||address.street=="")
           {
               address.street=address.street.trim()
               if(address.street=="")  delete address["street"]

           }
           if(address.city||address.city=="")
           {
               address.city=address.city.trim()
               if(address.city=="") delete address["city"]
            
           }
           if(address.pincode||address.pincode=="")
           {
              
               address.pincode=address.pincode.trim()
               if(address.pincode=="") delete address["pincode"]
             else if(!validator.isValidpin(address.pincode)) return res.status(400).send({status:false,message:"make sure pincode should be numeric only and 6 digit number"})
    
           }
           }
       }
     
    let makeUser=await userModel.create(data);

    return res.status(201).send({status:true,data:makeUser})
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
};



// user LOGIN

const loginUser=async function(req,res){
   try{ 

    if(Object.keys(req.body).length==0) return res.status(400).send({status:false,message:"Please provide details"});

    let email=req.body.email;
    let password=req.body.password;

    if(!email || !validator.isValid(email)) return res.status(400).send({status:false,message:"email must be present"});
    email=email.trim()
    if(!valid.isEmail(email))  return res.status(400).send({status:false,message:"please provide Valid email no"});
 
    if(!password) return res.status(400).send({status:false,message:"password must be present"});
   
    let findUser=await userModel.findOne({email:email,password:password});

    if(!findUser) return res.status(400).send({status:false,message:"email or password may be incorrect"});

    let token=jwt.sign({userId:findUser._id.toString() },"group10project",{ expiresIn: '24h' });

    res.setHeader("x-api-key",token);

    return res.status(200).send({status:true,data:token})

   }
   catch(error){
    return res.status(500).send({status:false,message:error.message})

   }

}



module.exports={creatUser,loginUser};


 