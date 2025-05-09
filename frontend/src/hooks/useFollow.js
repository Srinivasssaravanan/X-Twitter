import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { baseUrl } from "../constant/url";

const useFollow = () => {
	const queryClient = useQueryClient();

	const { mutate: follow, isPending } = useMutation({
		mutationFn: async (userId) => {
			try {
				const res = await fetch(`${baseUrl}/api/users/follow/${userId}`, {
					method: "POST",
					credentials : "include",
					headers : {
						"Content-Type":"application/json"
					}
				})
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw error;
			}
		},
		onSuccess: () => {
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),//Promise.all ensures they’re kicked off in parallel rather than one waiting for the other
				queryClient.invalidateQueries({ queryKey: ["authUser"] }), //used for updating folllowers list of  authUser
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { follow, isPending };
};

export default useFollow;