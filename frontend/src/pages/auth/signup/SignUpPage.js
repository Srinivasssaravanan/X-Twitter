import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail, MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Password toggle icons
import { useMutation,useQueryClient ,} from "@tanstack/react-query";
import { baseUrl } from "../../../constant/url";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const SignUpPage = () => {
	const navigate = useNavigate();  
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullname: "",
		password: "",
	});
    const queryClient = useQueryClient();
	const [showPassword, setShowPassword] = useState(false); // Password visibility state

	const { mutate: signup, isPending, isError, error } = useMutation({
		mutationFn: async ({ email, username, fullname, password }) => {
			try {
				const res = await fetch(`${baseUrl}/api/auth/signup`, {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({
						email,
						username,
						fullname,
						password,
					}),
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
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });

			navigate("/");
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="max-w-screen-xl mx-auto flex h-screen px-10">
			<div className="flex-1 hidden lg:flex items-center justify-center">
				<XSvg className="lg:w-2/3 fill-white" />
			</div>
			<div className="flex-1 flex flex-col justify-center items-center">
				<form className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
					<XSvg className="w-24 lg:hidden fill-white" />
					<h1 className="text-4xl font-extrabold text-white">Join today.</h1>

					{/* Email Input */}
					<label className="input input-bordered rounded flex items-center gap-2">
						<MdOutlineMail />
						<input
							type="email"
							className="grow text-white bg-transparent placeholder-gray-300 outline-none"
							placeholder="Email"
							name="email"
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>

					{/* Username & Full Name */}
					<div className="flex gap-4 flex-wrap">
						<label className="input input-bordered rounded flex items-center gap-2 flex-1">
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
						<label className="input input-bordered rounded flex items-center gap-2 flex-1">
							<MdDriveFileRenameOutline />
							<input
								type="text"
								className="grow text-white bg-transparent placeholder-gray-300 outline-none"
								placeholder="Full Name"
								name="fullname"
								onChange={handleInputChange}
								value={formData.fullname}
							/>
						</label>
					</div>

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
						{isPending ? <LoadingSpinner /> : "Sign Up"}
					</button>
					{isError && <p className="text-red-500">{error.message}</p>}
				</form>

				{/* Sign In Link */}
				<div className="flex flex-col lg:w-2/3 gap-2 mt-4">
					<p className="text-white text-lg">Already have an account?</p>
					<Link to="/login">
						<button className="btn rounded-full btn-primary text-white btn-outline w-full">
							Sign in
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
