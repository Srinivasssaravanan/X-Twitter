import { text } from "express";
import  Mongoose from "mongoose";
const postSchema = new Mongoose.Schema({
    user : {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   text : {
        type : String
    },
    img : {
        type : String
    },
    likes : [
        {
        type : Mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }],
    comments : [
    {
        text : {
            type : String,
            required : true
        },
        user : {
            type : Mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
    }],
   
},{timestamps : true});

const Post = Mongoose.model("Posts",postSchema);//"Posts" is the model name. It tells Mongoose that this model corresponds to a MongoDB collection called posts (Mongoose pluralizes the name by default).
export default Post;//MongoDB collections are always named in lowercase and pluralized form. So, "Posts" becomes the posts collection in MongoDB.
/**"Posts" is the model name, which defines the MongoDB collection (posts).

Post is the Mongoose model that provides methods to interact with the MongoDB posts collection, like creating, finding, updating, or deleting documents. */
//okk Posts is the model name it automatically creates a collection names as posts and you can create many document using Post 
//here it is used for creating collection and documents... Posts is the model name and mongoose.model() function creates the collections and further using mongoose model Post instance can be created.... the first arument is the model name using which the collection is created as posts 2nd argument is schema for that particular collection.. am i right all these words