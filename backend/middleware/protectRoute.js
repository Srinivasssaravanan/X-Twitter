import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
const protectRoute = async(req,res,next) =>{
try{
     const token = req.cookies.jwt; // this jwt is read from browser cookie if yes then user is authenticated orelse he is not authenticated
     if(!token)
     {
        return res.status(400).json({error : "unauthorized : no token provided"})
     }
     const decoded = jwt.verify(token,process.env.JWT_SECRET)//It checks that the JWT (token) was signed using your server's secret (process.env.JWT_SECRET).This ensures the token hasn't been tampered with by anyone — it's a way to verify authenticity.

     if(!decoded)
     {
        return res.status(400).json({error : "unauthorised : invalid token"})
     }
    const user = await User.findOne({_id : decoded.userId}).select("-password");// _id was predefinely created my mongoose.The _id field is predefined and automatically created by MongoDB (not just Mongoose). Every document you save in a MongoDB collection automatically gets a unique _id field, unless you manually override it (which is rare and not recommended).okkk if User mongoose model is used to retrieve info from mongodb and update and delete the documents am i  right
    if(!user)
    {
        return res.status(400).json({error : "user not found"})
    }
    req.user=user;
    next();
}
catch(error)
{
    console.log(`error in protectroute middleware : ${error}`)  
    res.status(500).json({error : "internal server error"});
}
}
export default protectRoute;
