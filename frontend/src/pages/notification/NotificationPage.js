import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";
import toast from "react-hot-toast";

const NotificationPage = () => {

	const queryClient = useQueryClient();

	const {data:notifications,isLoading} = useQuery({
     queryKey :["notifications"],
	 queryFn : async ()=>{
		try{
             const res = await fetch(`${baseUrl}/api/notifications`,{
				method:"GET",
				credentials : "include",
				headers : {
					"Content-Type" : "application/json"
				} 
			 })
			 const data = await res.json();
			 if(!res.ok){
				throw new Error(data.error || "something went wrong")
			 }
			 return data;
		}
		catch(error)
		{
			 throw error;
		}
	 }
	})

	const {mutate : delete_Notification} = useMutation({
		mutationFn : async ()=>{
		try{
          const res = await fetch(`${baseUrl}/api/notifications`,{
			method:"DELETE",
			credentials : "include",
			headers : {
				"Content-Type" : "application/json"
			}
		  })
		  const data = await res.json();
		  if(!res.ok)
		  {
			throw new Error(data.error || "something went wrong")
		  }
		  return data;
		}
		catch(error){
         throw error;
		}
	},
	onSuccess : ()=>{
		toast.success("all notification deleted");
		queryClient.invalidateQueries({queryKey :["notifications"]})
	},
	onError : (error)=>{
       toast.error(error.message)
	}
	})
	const deleteNotifications = () => {
     delete_Notification();
	};

	return (
		<> 
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>{/** This is the clickable trigger for the dropdown.A <div> is a non-interactive element by default. By adding tabIndex={0}, you: Make the div focusable with the keyboard (using the Tab key */}
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}  
							className='dropdown-content z-[1]  menu p-2 shadow bg-base-100 rounded-box w-52'
						>{/**if i remove this tabIndex={0}  then the content inside the dropbox is not functionalble */}
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;


/**MENU :
 * In DaisyUI, menu:

Styles the <ul> as a vertical menu list

Applies spacing, padding, and hover effects to its <li> and <a> children

Automatically sets cursor: pointer on <a> items inside the menu

✅ Without menu
 */

/**
 * 4. Why Would notification.username Cause an Error?
If your original notification object is structured like this:

json
Copy code
{
  "from": {
    "username": "john_doe",
    "profileImg": "/path/to/image.jpg"
  },
  "type": "follow"
}
The username is inside the from object, not directly in the notification object.

If you try to access notification.username, it will be undefined because username doesn’t exist directly on notification — it exists inside from.

So, using notification.username would not work here because the username is inside from.

What Happens If You Use notification.username?
Now, if you try to use notification.username instead of notification.from.username, this will only work if the username is directly part of the notification object.

If Your Object Looks Like This:
json
Copy code
{
  "username": "john_doe",
  "profileImg": "/path/to/image.jpg",
  "type": "follow"
}

 see the backend of notification
 
*/