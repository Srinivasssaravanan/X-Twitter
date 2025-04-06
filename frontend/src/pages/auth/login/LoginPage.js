import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";
import { MdPassword } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Icons for password toggle
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUser } from "react-icons/fa";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { baseUrl } from "../../../constant/url";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryCLient = useQueryClient();
	const [showPassword, setShowPassword] = useState(false); // Password visibility state

	const { mutate: login, isPending, isError, error } = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch(`${baseUrl}/api/auth/login`, {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({ username, password }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Logged in successfully");
			//refetch the authuser
			queryCLient.invalidateQueries({
				queryKey: ["authUser"]
			});
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		login(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="max-w-screen-xl mx-auto flex h-screen">
			<div className="flex-1 hidden lg:flex items-center justify-center">
				<XSvg className="lg:w-2/3 fill-white" />
			</div>
			<div className="flex-1 flex flex-col justify-center items-center">
				<form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
					<XSvg className="w-24 lg:hidden fill-white" />
					<h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>

					{/* Username Input */}
					<label className="input input-bordered rounded flex items-center gap-2">
						<FaUser />
						<input
							type="text"
							className="grow text-white bg-transparent placeholder-gray-300 outline-none"
							placeholder="Username"
							name="username"
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					{/* Password Input with Toggle */}
					<label className="input input-bordered rounded flex items-center gap-2 relative">
						<MdPassword />
						<input
							type={showPassword ? "text" : "password"}
							className="grow text-white bg-transparent placeholder-gray-300 outline-none"
							placeholder="Password"
							name="password"
							onChange={handleInputChange}
							value={formData.password}
						/>
						<button
							type="button"
							className="absolute right-4 text-gray-300 hover:text-white"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
						</button>
					</label>

					{/* Submit Button */}
					<button className="btn rounded-full btn-primary text-white">
						{isPending ? <LoadingSpinner /> : "Login"}
					</button>
					{isError && <p className="text-red-500">{error.message}</p>}
				</form>

				{/* Sign Up Link */}
				<div className="flex flex-col gap-2 mt-4">
					<p className="text-white text-lg">{"Don't"} have an account?</p>
					<Link to="/signup">
						<button className="btn rounded-full btn-primary text-white btn-outline w-full">
							Sign up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
/*

import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery , useQueryClient} from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const {data:authUser} = useQuery({queryKey :["authUser"]});
	const queryClient = useQueryClient()
	const {mutate:CreatePost,isPending,isError,error} = useMutation({
		mutationFn : async({text,img})=>{
			try{
				 const res = await fetch(`${baseUrl}/api/posts/create`,{
				 method : "POST",
				 credentials : "include",
				 headers :{
					"Content-Type" : "application/json"
				 },
				 body:JSON.stringify({text,img})
				 })
				 const data = await res.json();
				 if(!res.ok){
					throw new Error(data.error || "something went wrong")
				 }
				 return data
			}
			catch(error)
			{
			   throw error
			}
		},
		onSuccess :()=>{
			setImg(null)
			setText("")
			toast.success("post created successfully")
			queryClient.invalidateQueries({queryKey:["posts"]})

		}
	})

	const handleSubmit = (e) => {
		e.preventDefault();
		CreatePost({text,img})
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser.profileImg|| "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' alt="profileImage" />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? <LoadingSpinner size="sm"/> : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{error.message}</div>}
			</form>
		</div>
	);
};
export default CreatePost;*/