import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minLength : 6
    },
    followers :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : []
    }
  ],
  following :[{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    default : []
    }
  ],
  profileImg : {
    type : String,
    default : ""
  },
  coverImg : {
    type : String,
    default : ""
  },
  bio : {
    type : String,
    default : ""
  },
  link : {
    type : String,
    default : ""
  },
  likedPosts : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Post",
    default : []
  }], 
},{timestamps : true}) 
const User = mongoose.model("User",UserSchema);/*this automatically takes the collection of users*/

export default User
{/**Mongoose automatically refers to the users collection in your MongoDB database. Here's how it works:

Model Name: The first argument, "User", is the model name.

Collection Name: Mongoose automatically converts the model name ("User") to a plural, lowercase form to determine the collection name in MongoDB. So, the collection name will be "users". */}
//Not exactly! While Mongoose models (like User) are often used for retrieving data from the database, they can also be used for creating, updating, and deleting data in MongoDB. They are not just for retrieving data.
