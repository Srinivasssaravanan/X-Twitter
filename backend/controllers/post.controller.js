import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import cloudinary from "cloudinary";
import Notification from "../model/notification.model.js";

// CREATE POST
export const createPost = async (req, res) => {
    try {
        console.log("req.user:", req.user); // Debugging

        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!text && !img) {
            return res.status(400).json({ error: "Post must have text or image" });
        }

        if (img) {
            try {
                const uploadedResponse = await cloudinary.uploader.upload(img);
                img = uploadedResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ error: "Image upload failed" });
            }
        }

        const newPost = new Post({ user: userId, text, img });
        await newPost.save();

        return res.status(201).json(newPost);
    } catch (error) {
        console.log(`Error in create post controller: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// DELETE POST
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(id);
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(`Error in delete post controller: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// CREATE COMMENT
export const createcomment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: "Comment text is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = { text, user: userId };
        post.comments.push(comment);
        await post.save();

        return res.status(200).json(post);
    } catch (error) {
        console.log(`Error in comment controller: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// LIKE / UNLIKE POST
export const likeunlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId); // ✅ Fix here

		if (userLikedPost) {
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter(
				(id) => id.toString() !== userId.toString()
			);

			return res.status(200).json(updatedLikes); // ✅ send array directly
		} else {
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			return res.status(200).json(post.likes); // ✅ send updated likes
		}
	} catch (error) {
		console.log(`Error in like/unlike controller: ${error}`);
		return res.status(500).json({ error: "Internal server error" });
	}
};


// GET ALL POSTS
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("user", "-password")
            .populate("comments.user", "-password -email -followers -following -link -bio");

        return res.status(200).json(posts);
    } catch (error) {
        console.log(`Error in getAllPosts controller: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// GET LIKED POSTS
export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate("user", "-password")
            .populate("comments.user", "-password -email -followers -following -link -bio");

        return res.status(200).json(likedPosts);
    } catch (error) {
        console.error(`Error in getLikedPosts controller: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// GET FOLLOWING USERS' POSTS
export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const following = user.following;
        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate("user", "-password")
            .populate("comments.user", "-password");

        return res.status(200).json(feedPosts);
    } catch (error) {
        console.error(`Error in getFollowingPosts controller: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// GET USER POSTS
export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate("user", "-password")
            .populate("comments.user", "-password");

        return res.status(200).json(posts);
    } catch (error) {
        console.error(`Error in getUserPosts controller: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};
