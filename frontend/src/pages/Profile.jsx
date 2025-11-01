import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContex";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";
// Removed Firestore imports

const Profile = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { currentUser } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Fetch user details from backend
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${getBaseUrl()}/api/users/me`);
        if (response.data.user) {
          setUserDetails({
            username: response.data.user.username || "",
            email: response.data.user.email || "",
            phoneNumber: response.data.user.phoneNumber || "",
          });
          setEditUsername(response.data.user.username || "");
          setEditPhone(response.data.user.phoneNumber || "");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    // Call backend API to change password
    try {
      await axios.post(`${getBaseUrl()}/api/users/change-password`, {
        email: userDetails.email,
        oldPassword,
        newPassword,
      });
      setPasswordSuccess("Password changed successfully.");
      setShowChangePassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password."
      );
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    if (!editUsername || !editPhone) {
      setEditError("Username and phone number are required.");
      return;
    }
    try {
      // TODO: Implement backend endpoint for updating user profile
      // await axios.put(`${getBaseUrl()}/api/users/update`, {
      //   username: editUsername,
      //   phoneNumber: editPhone,
      // });
      setUserDetails((prev) => ({
        ...prev,
        username: editUsername,
        phoneNumber: editPhone,
      }));
      setEditSuccess("Profile updated successfully.");
      setEditMode(false);
    } catch (err) {
      setEditError("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">No User Logged In</h2>
          <p className="text-gray-600">
            Please log in to view your profile details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6">My Profile</h2>
        <div className="mb-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700 mb-4 border-4 border-blue-200 shadow">
            {userDetails.username
              ? userDetails.username.slice(0, 2).toUpperCase()
              : "U"}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {userDetails.username}
          </h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 w-full text-left shadow-sm mb-6">
          <div className="mb-4">
            <span className="font-semibold text-gray-700">Username:</span>
            <span className="ml-2 text-gray-900">{userDetails.username}</span>
          </div>
          <div className="mb-4">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{userDetails.email}</span>
          </div>
          <div className="mb-4">
            <span className="font-semibold text-gray-700">Phone Number:</span>
            <span className="ml-2 text-gray-900">
              {userDetails.phoneNumber || "Not provided"}
            </span>
          </div>
        </div>

        {/* Change Password Section */}
        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {showChangePassword ? "Cancel" : "Change Password"}
        </button>

        {showChangePassword && (
          <div className="mt-6 w-full">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="text-green-500 text-sm">{passwordSuccess}</div>
              )}

              <button
                type="submit"
                className="w-full bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
