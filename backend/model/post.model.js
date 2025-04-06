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

const Post = Mongoose.model("Posts",postSchema);
export default Post;