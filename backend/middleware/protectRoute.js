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

{/**when you login using username and password then server will send a web token to me and it will be stored in browser cookie and then if i make any operations like moving to profilepage or moving to notification or anyother page then the browser sends that token along with the request then server checks it if it matches then it will move to that particular page  */}
{/**ohooo ok when user logged in , server checks for authentication if it is correct then server creates a webtoken using the userid and the given jwt secret.its like creating a web token and signing with the jwt_secret and this will be sent to the browser, if the user makes a new rrequest then the jwt token will be sent from user to the server and server checks whether it is valid and the token is signed by me that is server with jwt_Secret */}
{/**its like locking it with secret key . signing is like locking */}
{/**if token is expired then we have to login again with credentials right each time while login it generated new token */}
{/**Think of protectRoute as the security guard at the entrance of a VIP lounge (protected route). The user (browser) must show a valid, signed ID (JWT in cookie). If it's valid, they’re let in and their identity is noted (req.user). If not, they're denied access. */}