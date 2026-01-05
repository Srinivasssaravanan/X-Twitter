import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary"
export const getProfile = async(req,res)=>{
    try{
        const {username} = req.params;
        const user = await User.findOne({username})
        if(!user)
        {
            return res.status(404).json({error : "user not found"})
        }
        res.status(200).json(user);
    }
    catch(error){
        console.log(`error in get user profile controller : ${error}`)
        res.status(500).json({error :
             "internal server error"})
    }
}

export const followUnFollowUser = async(req,res)=>{
    try{
        const {id} = req.params;
        const userToModify = await User.findById({_id : id});
        const currentUser = await User.findById({_id :req.user._id})
        if(id === req.user._id)
        {
            return res.status(400).json({error : "you can't unfollow/follow"})
        }
        if(!userToModify || !currentUser)
        {
            return res.status(404).json({error:"user not found"})
        }
        const isFollowing = currentUser.following.includes(id);

        if(isFollowing)
        {
            //unfollow
            await User.findByIdAndUpdate({_id:id},{$pull:{followers :req.user._id}})// avan id la ulla followers la irunthu enna remove pannum
            await User.findByIdAndUpdate({_id : req.user._id},{$pull:{following:id}})// en following la irunthu avan remove aavan
            res.status(200).json({message : "unfollow success"});
        }
        else{
            //follow
            await User.findByIdAndUpdate({_id:id},{$push:{followers :req.user._id}})
            await User.findByIdAndUpdate({_id : req.user._id},{$push:{following:id}})
            const newNotification = new Notification({
                type : "follow",
                from : req.user._id,
                to   : userToModify._id 
            })
            await newNotification.save();
            // send notification
            res.status(200).json({message : "follow success"});
        }
    }
    catch(error){
        console.log(`error in follow unfollow user controller : ${error}`)
        res.status(500).json({error : "internal server error"})
    }
}

export const getSuggestedUsers = async(req,res)=>{
    try{
        const userId = req.user._id;//current user
        const userFollowedByMe = await User.findById({_id : userId}).select("-password")

        const users = await User.aggregate([
          {
              $match : {
                _id : {$ne : userId}
            }
        }
     ])
        const fillteredUsers = users.filter((user)=> !userFollowedByMe.following.includes(user._id))//here filltered users stores the user in users list which is true
        const suggestedUsers = fillteredUsers.slice(0,4);

        suggestedUsers.forEach((user) =>(user.password = null))
        res.status(200).json(suggestedUsers);

    }
    catch(error){
        console.log(`error in get suggested users controller : ${error}`)
        res.status(500).json({error : "internal server error"})
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, fullname, email, currentPassword, newPassword, bio, link } = req.body;
        let { profileImg, coverImg } = req.body;
        let user = await User.findById({_id:userId});
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Validate password change
        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current and new password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must have at least 6 characters" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Profile Image Upload
      if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            user.profileImg = uploadedResponse.secure_url;
        }

        // Cover Image Upload
        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            user.coverImg = uploadedResponse.secure_url;
        }

        // Update user fields
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;

        await user.save();

        // Return updated user without password
        const updatedUser = await User.findById(userId).select("-password");
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(`Error in updateUser controller: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
