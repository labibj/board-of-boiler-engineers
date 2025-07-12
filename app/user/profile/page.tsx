"use client";
import React, { useState, useEffect } from "react";
import { sidebarLinks } from "@/app/data/sidebarLinks";
import { handleLogout } from "@/app/utils/logout";
import useAuthRedirect from "@/app/hooks/useAuthRedirect";
import Link from "next/link";
import Image from "next/image";
import {
  FaBell,
  FaSignOutAlt,
  FaEllipsisV,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import UserFooter from "@/app/components/UserFooter";

// Define the type for user profile data fetched from backend
interface UserProfileData {
  name: string;
  email: string;
  cnic: string;
  profilePhoto: string | null;
  // Add other fields you fetch and display here
}

export default function Profile() {
  useAuthRedirect(); // 👈 Ensures user is logged in
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // To hold the actual file object
  const [displayedImageUrl, setDisplayedImageUrl] = useState<string | null>(null); // To hold the URL for Image component
  const [message, setMessage] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true); // New loading state for profile data
  const [updatingProfile, setUpdatingProfile] = useState(false); // New loading state for update

  // ✅ Form state initialized with empty strings, will be populated by fetched data
  const [formData, setFormData] = useState<UserProfileData>({
    name: "",
    email: "",
    cnic: "",
    profilePhoto: null,
  });

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User not authenticated. Please log in.");
        setLoadingProfile(false);
        return;
      }

      const res = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setFormData(data.data); // Populate form with fetched data
        setDisplayedImageUrl(data.data.profilePhoto || "/profile-photo.png"); // Set initial display image
      } else {
        setMessage(`Failed to load profile: ${data.error || 'Unknown error'}`);
        console.error("Failed to fetch user profile:", data);
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      setMessage("An error occurred while loading profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file); // Store the actual file
      setDisplayedImageUrl(URL.createObjectURL(file)); // Create URL for immediate display
    } else {
      setSelectedImageFile(null);
      // If no file selected, revert to current profile photo or default
      setDisplayedImageUrl(formData.profilePhoto || "/profile-photo.png");
    }
  };

  // ✅ Handle form input changes (for other potential fields, though not explicitly in current form)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This part is for text inputs like name, email, cnic if they were editable
    // For now, these are displayed from formData, not directly editable by this form handler.
    // If you add editable text fields, you'd update this.
    // setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit handler for updating profile (mainly photo for now)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setUpdatingProfile(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ User not authenticated.");
      setUpdatingProfile(false);
      return;
    }

    const updateFormData = new FormData();
    if (selectedImageFile) {
      updateFormData.append("profilePhotoFile", selectedImageFile); // 'profilePhotoFile' matches backend expected name
    }
    // If you had other editable fields, you'd append them here:
    // updateFormData.append("name", formData.name);
    // updateFormData.append("email", formData.email);
    // updateFormData.append("cnic", formData.cnic);

    if (!selectedImageFile) { // If only photo upload is implemented, check if a file is selected
        setMessage("Please select a new photo to update.");
        setUpdatingProfile(false);
        return;
    }


    try {
      const res = await fetch("/api/user/profile", { // Changed to /api/user/profile
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' is NOT needed for FormData, browser sets it automatically
        },
        body: updateFormData, // Send FormData directly
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
        // Update the displayed image URL with the new URL from backend
        if (data.profilePhotoUrl) {
            setDisplayedImageUrl(data.profilePhotoUrl);
            setFormData(prev => ({ ...prev, profilePhoto: data.profilePhotoUrl })); // Update formData state too
        }
        setSelectedImageFile(null); // Clear the selected file input
      } else {
        setMessage(`❌ ${data.error || data.message || 'Failed to update profile.'}`);
        console.error("Update error:", data);
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ An error occurred while updating profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-[#004432]">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen font-sans">
        {/* Topbar for mobile */}
        <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
          <h1 className="text-lg font-bold">USER PROFILE</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-[#004432] text-white p-6 flex flex-col z-50 absolute md:relative top-0 left-0 h-full md:h-auto overflow-y-auto`}
        >
          <div className="flex justify-end mb-4 md:hidden">
            <button onClick={() => setSidebarOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="flex flex-col items-center mb-8">
            <Link href="/user/dashboard">
              <Image
                src="/dashboard-logo.png"
                alt="Dashboard Logo"
                width={130}
                height={70}
              />
            </Link>
            <h5 className="lg:text-base md:text-base text-sm font-bold text-center">
              BOARD OF EXAMINATION
            </h5>
            <h6 className="text-[#258c71] font-nato text-sm">
              (FOR BOILER ENGINEERS)
            </h6>
          </div>
          {/* Sidebar Content */}
          <nav className="flex flex-col space-y-4 w-full">
            {sidebarLinks.map((item, index) =>
              item.isLogout ? (
                <button
                  key={index}
                  onClick={() => handleLogout("/user/login")}
                  className="flex items-center space-x-3 hover:text-gray-300 w-full text-left cursor-pointer"
                >
                  <Image src={item.icon} alt="Logout Icon" width={20} height={20} />
                  <span className="font-semibold tracking-wide">{item.label}</span>
                </button>
              ) : (
                <div className="flex flex-col space-y-4 w-full" key={index}>
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-3 hover:text-gray-300"
                >
                  <Image src={item.icon} alt={`${item.label} Icon`} width={20} height={20} />
                  <span className="font-semibold tracking-wide">{item.label}</span>
                </Link>
                  <hr className="border-t border-white w-full" />
                </div>
              )
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Top Bar */}
          <div className="hidden md:flex justify-between items-center bg-[#dad5cf] shadow p-4">
            <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">
              USER PROFILE
            </h1>
            <div className="flex items-center space-x-4 text-gray-700">
              <FaBell className="w-5 h-5 cursor-pointer" />
              <FaSignOutAlt className="w-5 h-5 cursor-pointer" onClick={() => handleLogout("/user/login")} />
              <FaEllipsisV className="w-5 h-5 cursor-pointer" />
            </div>
          </div>

          {/* Profile Form Content */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 bg-white">
            <form onSubmit={handleUpdate} className="max-w-xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-[#004432] mb-6 text-center">Your Profile</h2>

                {/* Profile Photo Section */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-200 shadow relative border-2 border-gray-300">
                        <Image
                            src={displayedImageUrl || "/profile-photo.png"} // Use displayedImageUrl
                            alt="Profile Photo"
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <input
                        id="profileUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="profileUpload"
                        className="mt-2 text-sm text-[#004432] underline cursor-pointer font-bold"
                    >
                        Change Photo
                    </label>
                </div>

                {/* Message display */}
                {message && (
                    <p className={`text-center mb-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}

                {/* Profile Information Display (Read-only for now) */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">{formData.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">{formData.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CNIC</label>
                        <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">{formData.cnic}</p>
                    </div>
                    {/* Add other display fields here if needed */}
                </div>

                {/* Update Button */}
                <div className="mt-6 text-center">
                    <button
                        type="submit"
                        disabled={updatingProfile}
                        className={`px-6 py-2 rounded-md font-semibold transition ${
                            updatingProfile
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#004432] text-white hover:bg-[#003522]'
                        }`}
                    >
                        {updatingProfile ? "Updating..." : "Update Profile Photo"}
                    </button>
                </div>
            </form>
          </div>

          <UserFooter />
        </div>
      </div>
    </>
  );
}
