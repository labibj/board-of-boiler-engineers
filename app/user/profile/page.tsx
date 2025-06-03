"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes } from "react-icons/fa";
import UserFooter from "@/app/components/UserFooter";

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen font-sans">
        {/* Mobile Topbar */}
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
          } md:block w-full md:w-64 bg-[#004432] text-white p-6 flex flex-col z-50 absolute md:relative top-0 left-0 h-full md:h-auto`}
        >
          <div className="flex justify-end mb-4 md:hidden">
            <button onClick={() => setSidebarOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center mb-8">
            <Link href="/user/dashboard">
              <Image src="/dashboard-logo.png" alt="Dashboard Logo" width={130} height={70} />
            </Link>
            <h5 className="lg:text-base md:text-base text-sm font-bold text-center">
              BOARD OF EXAMINATION
            </h5>
            <h6 className="text-[#258c71] font-nato text-sm">(FOR BOILER ENGINEERS)</h6>
          </div>

          <nav className="flex flex-col space-y-4 w-full">
            <Link href="/user/dashboard" className="flex items-center space-x-3 hover:text-gray-300">
              <Image src="/dashboard-icon.png" alt="Dashboard Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Dashboard</span>
            </Link>
            <hr className="border-t border-white w-full" />

            <Link href="/user/profile/" className="flex items-center space-x-3 hover:text-gray-300">
              <Image src="/profile-icon.png" alt="Profile Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Profile</span>
            </Link>
            <hr className="border-t border-white w-full" />

            <Link href="/user/applications/" className="flex items-center space-x-3 hover:text-gray-300">
              <Image src="/application-icon.png" alt="Applications Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Applications</span>
            </Link>
            <hr className="border-t border-white w-full" />

            <Link href="/user/dashboard/" className="flex items-center space-x-3 hover:text-gray-300">
              <Image src="/datesheet-icon.png" alt="Date Sheet Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Date Sheet</span>
            </Link>
            <hr className="border-t border-white w-full" />

            <Link href="/user/results" className="flex items-center space-x-3 hover:text-gray-300">
              <Image src="/result-icon.png" alt="Result Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Result</span>
            </Link>
            <hr className="border-t border-white w-full" />

            <Link href="/logout" className="flex items-center space-x-3 hover:text-gray-300 mt-4">
              <Image src="/logout-icon.png" alt="Logout Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Logout</span>
            </Link>
            <hr className="border-t border-white w-full" />
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar for Desktop */}
          <div className="hidden md:flex justify-between items-center bg-[#dad5cf] shadow p-4">
            <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">USER PROFILE</h1>
            <div className="flex items-center space-x-4 text-gray-700">
              <FaBell className="w-5 h-5 cursor-pointer" />
              <FaSignOutAlt className="w-5 h-5 cursor-pointer" />
              <FaEllipsisV className="w-5 h-5 cursor-pointer" />
            </div>
          </div>

          {/* Profile Form Content */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 bg-white">

            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-200 shadow relative">
                <Image
                  src={selectedImage || "/profile-photo.png"}
                  alt="Profile Photo"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full "
                />
              </div>

              {/* Hidden file input */}
              <input
                id="profileUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Label for file input */}
              <label htmlFor="profileUpload" className="mt-2 text-sm text-[#004432] underline cursor-pointer font-bold">
                Change Photo
              </label>
            </div>

            {/* Form */}
            <form className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
              <input
                type="text"
                placeholder="Father Name"
                className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
              <input
                type="email"
                placeholder="Email"
                className="col-span-1 md:col-span-2  border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
              <input
                type="date"
                placeholder="Date of Birth"
                className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
              <input
                type="text"
                placeholder="Present Address"
                className="col-span-1 md:col-span-2  border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
              <input
                type="text"
                placeholder="Permanent Address"
                className="col-span-1 md:col-span-2  border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
            </form>

            {/* Update Button */}
    <div className="flex justify-center items-center gap-1 mt-3">
      <span className="bg-black text-white rounded-l-md py-3 px-4 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </span>
      <button
        type="submit"
        className="cursor-pointer bg-[#004432] text-white px-8 py-3 rounded-r-md font-semibold hover:bg-[#003522] transition"
      >
       UPDATE
      </button>
    </div>
          </div>

          {/* Footer */}
          <UserFooter />
        </div>
      </div>
    </>
  );
}
