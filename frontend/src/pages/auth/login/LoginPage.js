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
	const [showPassword, setShowPassword] = useState(false); // Password visibility state initially it is false meaning that is hidden
	    
	const { mutate: login, isPending, isError, error } = useMutation({
		mutationFn: async ({ username, password }) => {
		    try {         
				const res = await fetch(`${baseUrl}/api/auth/login`, {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-type": "application/json",// json format la anupren to server.. Tells server you're sending JSON
						Accept: "application/json",//"error": "Invalid username or password"|| “I want the response in JSON format.”||Tells server you want JSON back
					},
					body: JSON.stringify({ username, password }),//if i type name it is in js normal object format and "Content-type": "application/json" this says it(server) accepts only json format and then  Accept: "application/json" this says i want response in json format but when i type name and password in login form it is in js normal object format.... so that the typed username and password should be converted into json format right so that body: JSON.stringify({ username, password }), is used 
				});// na anupura data is stored in body
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
			queryCLient.invalidateQueries({ //if i logged in then the data is stored in cache after sometime the cache may get stale right so while at login at another time the data must be changed so that the cache will be changed to fresh instead of old stale login
				queryKey: ["authUser"]
        //oho ok if user enters login credentials and submit then if both are correct then it makes toast message and refetch the authUser so that it updates the data of the authUser for that particulaar user like browser cache tme ans fresh tme and all these stuffs so that while refetching using key authUser it runs the authUser and the data of that particular user is sent to the data and it is retuned so that authUser contains some data so it moves to home pag
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
		{/* On large screens and above (lg: breakpoint in Tailwind), this overrides hidden and displays the div as a flex container.
            So, this section only appears on large screens (typically ≥1024px width).*/}
			<div className="flex-1 hidden lg:flex items-center justify-center">{/**usually at first it is hidden but after lg:flex it acts as a flex container */}
				<XSvg className="lg:w-2/3 fill-white" /> {/**large,hidden for small  */}
			</div>
			<div className="flex-1 flex flex-col justify-center items-center">
				<form className="flex gap-5 flex-col" onSubmit={handleSubmit}>
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
						<MdPassword />{/**grow: This class comes from Tailwind CSS. It makes the input field grow to fill the available space within the flex container.text-white: Applies white text color to the input field, so the entered text will be displayed in white. */}
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
/**
 two logos or xsvg one for large another for small
 if img size is large then image comes left of text if xsvg is small then it comes to top of text
 */