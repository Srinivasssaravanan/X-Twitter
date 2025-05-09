import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart,FaHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";
import { formatPostDate } from "../../utils/data";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");

	const { data: authUser } = useQuery({ // here the data of the user is sent to authUser right??? only data is returned right
		queryKey: ["authUser"],
		queryFn: async () => {
			const res = await fetch(`${baseUrl}/api/auth/me`, {
				credentials: "include",
			});
			if (!res.ok) throw new Error("Failed to fetch auth user");
			return res.json();
		},
	});

	const queryClient = useQueryClient();

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`${baseUrl}/api/posts/${post._id}`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "something went wrong");
			}
			return data;
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });// like refreshing the posts component
		},
	});

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`${baseUrl}/api/posts/like/${post._id}`, {
				method: "POST",//But — even though it’s a POST request to send something, the server usually responds back with some updated data in the response body — typically the updated likes array for the post.
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "something went wrong");
			}
			return data;
		},
		onSuccess: (updatedLikes) => {//here updatedLikes refers to updated data that is returned from the Above fxn it can be of any name
			const userLiked = updatedLikes.includes(authUser._id);
			toast.success(userLiked ? "Post liked" : "Post unliked");
		
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };//Now, let's say you want to update the likes property of this post, but you don't want to modify the original post object. Instead, you want to keep the other properties (like _id, text, and author) as they are
					}
					return p;
				});
			});
		},
		
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`${baseUrl}/api/posts/comment/${post._id}`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: comment }),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "something went wrong");
			}
			return data;
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const postOwner = post.user;

	const likes = Array.isArray(post.likes) ? post.likes : [];
	const isLiked =
		Array.isArray(post.likes) && authUser?._id
			? post.likes.includes(authUser._id)
			: false;

	const isMyPost = authUser?._id === post.user._id;
	const formattedDate = formatPostDate(post.createdAt);

	const handleDeletePost = () => {
		deletePost();
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		likePost();
	};

	return (
		<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
			<div className='avatar'>
				<Link
					to={`/profile/${postOwner.username}`}
					className='w-10 h-10 rounded-full overflow-hidden'
				>
					<img
						src={postOwner.profileImg || "/avatar-placeholder.png"}
						alt='profile'
					/>
				</Link>
			</div>
			<div className='flex flex-col flex-1'>
				<div className='flex gap-2 items-center'>
					<Link to={`/profile/${postOwner.username}`} className='font-bold'>
						{postOwner.fullname}
					</Link>
					<span className='text-gray-700 flex gap-1 text-sm'>
						<Link to={`/profile/${postOwner.username}`}>
							@{postOwner.username}
						</Link>
						<span>·</span>
						<span>{formattedDate}</span>
					</span>
					{isMyPost && (
						<span className='flex justify-end flex-1'>
							{!isDeleting && (
								<FaTrash
									className='cursor-pointer hover:text-red-500'
									onClick={handleDeletePost}
								/>
							)}
							{isDeleting && <LoadingSpinner size='sm' />}
						</span>
					)}
				</div>

				<div className='flex flex-col gap-3 overflow-hidden'>
					<span>{post.text}</span>
					{post.img && (
						<img
							src={post.img}
							className='h-80 object-contain rounded-lg border border-gray-700'
							alt=''
						/>
					)}
				</div>

				<div className='flex justify-between mt-3'>
					<div className='flex gap-4 items-center w-2/3 justify-between'>
						{/* Comments */}
						<div
							className='flex gap-1 items-center cursor-pointer group'
							onClick={() =>
								document.getElementById(`comments_modal${post._id}`).showModal()
							}
						>
							<FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
							<span className='text-sm text-slate-500 group-hover:text-sky-400'>
								{post.comments.length}
							</span>
						</div>

						{/* Modal for Comments */}
						<dialog
							id={`comments_modal${post._id}`}
							className='modal border-none outline-none'
						>
							<div className='modal-box rounded border border-gray-600'>
								<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
								<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
									{post.comments.length === 0 && (
										<p className='text-sm text-slate-500'>
											No comments yet 🤔 Be the first one 😉
										</p>
									)}
									{post.comments.map((comment) => (
										<div key={comment._id} className='flex gap-2 items-start'>
											<div className='avatar'>
												<div className='w-8 rounded-full'>
													<img
														src={
															comment.user.profileImg ||
															"/avatar-placeholder.png"
														}
														alt='comment profile'
													/>
												</div>
											</div>
											<div className='flex flex-col'>
												<div className='flex items-center gap-1'>
													<span className='font-bold'>
														{comment.user.fullname}
													</span>
													<span className='text-gray-700 text-sm'>
														@{comment.user.username}
													</span>
												</div>
												<div className='text-sm'>{comment.text}</div>
											</div>
										</div>
									))}
								</div>

								<form
									className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
									onSubmit={handlePostComment}
								>
									<textarea
										className='textarea w-full p-2 rounded text-md resize-none border focus:outline-none border-gray-800'
										placeholder='Add a comment...'
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>
									<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
										{isCommenting ? (
											<LoadingSpinner size='md' />
										) : (
											"Post"
										)}
									</button>
								</form>
							</div>
							<form method='dialog' className='modal-backdrop'>
								<button className='outline-none'>close</button>
							</form>
						</dialog>

						{/* Repost */}
						<div className='flex gap-1 items-center group cursor-pointer'>
							<BiRepost className='w-6 h-6 text-slate-500 group-hover:text-green-500' />
							<span className='text-sm text-slate-500 group-hover:text-green-500'>
								0
							</span>
						</div>

						{/* Like */}
						<div
							className='flex gap-1 items-center group cursor-pointer'
							onClick={handleLikePost}
						>
							{isLiking && <LoadingSpinner size='sm' />}
							{!isLiked && !isLiking && (
								<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
							)}
						{isLiked && !isLiking && (
	                        <FaHeart className='w-4 h-4 cursor-pointer text-pink-500' />)}

							<span
								className={`text-sm  group-hover:text-pink-500 ${
									isLiked ? "text-pink-500" : "text-slate-500"
								}`}
							>
								{likes.length}
							</span>
						</div>
					</div>

					{/* Bookmark */}
					<div className='flex w-1/3 justify-end gap-2 items-center'>
						<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-500' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;

//if someone uses post component then it is passed as a parameter
//so that if anydata can be passed as a parameter right??
//here const Post = ({ post }) => { post is just a name right any name can be given and can be used as.
/**So, Why is authUser Needed in This Code?
In the part of the code where you are checking whether a post is liked or not, you need the data of the authenticated user (authUser). Here’s why it’s required:

authUser._id is being compared to post.user._id to check if the current logged-in user is the same as the one who created the post (so that the "Delete" button can be shown for the post creator).

Also, authUser._id is needed in the "Like" feature to check if the authenticated user has liked the post or not (isLiked logic). */

/**
 It’s not a direct DOM/UI refresh like window.location.reload().
→ Instead — it triggers a data refresh from the server, and when the data updates in React Query’s cache, the UI that uses that data (via useQuery(["posts"])) automatically re-renders with the new fresh data
 */