import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import { baseUrl } from "../../constant/url";

const EditProfileModal = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const fetchAuthUser = async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch auth user");
    }
    return data;
  };

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullname: authUser.fullname || "",
        username: authUser.username || "",
        email: authUser.email || "",
        bio: authUser.bio || "",
        link: authUser.link || "",
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() => document.getElementById("edit_profile_modal").showModal()}
      >
        Edit profile
      </button>

      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.fullname}
                name="fullname"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>

            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />

            <button className="btn btn-primary rounded-full btn-sm text-white" type="submit">
              {isUpdatingProfile ? <LoadingSpinner size="sm" /> : "Update"}
            </button>
          </form>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline rounded-full btn-sm">Close</button>{/**If a form associated with a <dialog> has method="dialog", then submitting it will close the dialog. */}
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default EditProfileModal;


