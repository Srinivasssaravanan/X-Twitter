import User from "../model/user.model.js"
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
export const signup =async(req, res) => {
    try{
       const {username, fullname , email , password} = req.body;
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if(!emailRegex.test(email))
       {
        return res.status(400).json({error : "Invalid email format"})
       }
       const existingEmail  = await User.findOne({email})
       const existingUsername = await User.findOne({username})
       if(existingEmail || existingUsername)
       {
        return res.status(400).json({error : " already exisiting user or email"})
       }
       if(password.length < 6 )
       {
        return res.status(400).json({error : "password mustbe atleats 6char length" })
       }
       // hashing the password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,salt);
       const newUser = new User({
         username,
         fullname,
         email,
         password : hashedPassword
       })
       if(newUser)
       {
        generateToken(newUser._id,res)
        await newUser.save();
        res.status(200).json({
            _id :  newUser._id,
            username : newUser.username,
            fullname : newUser.fullname,
            email : newUser.email,
            followers : newUser.followers,
            following : newUser.following,
            profileImg : newUser.profileImg,
            coverImg : newUser.coverImg,
            bio : newUser.bio,
            link : newUser.link
        })
       }
       else{
        res.status(400).json({error : "invalid user data"})
       }
    }
    catch(error){
    console.log(`error in sign up in signup : ${error}`)
    res.status(500).json({error : "internal server error"})
    }
}
export const login = async (req, res) => {
    try{
         const {username , password} = req.body;
         const user = await User.findOne({username});
         const ispasswordcorrect = await bcrypt.compare(password,user?.password || "");
         
        if(!user ||  !ispasswordcorrect)
        {
            return res.status(400).json({error : "invalid username or password"})
        }
        generateToken(user._id,res);

        res.status(200).json({
            _id :  user._id,
            username : user.username,
            fullname :user.fullname,
            email : user.email,
            followers : user.followers,
            following : user.following,
            profileImg : user.profileImg,
            coverImg : user.coverImg,
            bio : user.bio,
            link : user.link
        })
    }
    catch(error){
      console.log(`error in login in login : ${error}`)  
      res.status(500).json({error : "internal server error"});
    }
}
export const logout = async (req, res) => {
  try{
       res.cookie("jwt","",{maxAge : 0})
       res.status(200).json({message : "logout successfully"});
  }
  catch(error){
    console.log(`error in logout : ${error}`)  
    res.status(500).json({error : "internal server error"});
  }
}

export const getMe = async (req,res)=> {
    try{
      const user = await User.findOne({_id : req.user._id}).select("-password")
      res.status(200).json(user);
    }
    catch(error){
        console.log(`error in getMe : ${error}`)  
        res.status(500).json({error : "internal server error"});
    }
}