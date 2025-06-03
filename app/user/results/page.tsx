"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes } from "react-icons/fa";
import UserFooter from "@/app/components/UserFooter";

export default function Results() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen font-sans">
        {/* Mobile Topbar */}
        <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
          <h1 className="text-lg font-bold">USER RESULTS</h1>
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
          {/* Mobile Close Button inside sidebar */}
          <div className="flex justify-end mb-4 md:hidden">
            <button onClick={() => setSidebarOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/user/dashboard">
              <Image src="/dashboard-logo.png" alt="Dashboard Logo" width={130} height={70} />
            </Link>
            <h5 className="lg:text-base md:text-base text-sm font-bold text-center">
              BOARD OF EXAMINATION
            </h5>
            <h6 className="text-[#258c71] font-nato text-sm">(FOR BOILER ENGINEERS)</h6>
          </div>

          {/* Navigation */}
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
        <div className="flex-1 flex flex-col justify-between min-h-screen">
          <div>
            {/* Top Bar for Desktop */}
            <div className="hidden md:flex justify-between items-center bg-[#dad5cf] shadow p-4">
              <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">USER RESULTS</h1>
              <div className="flex items-center space-x-4 text-gray-700">
                <FaBell className="w-5 h-5 cursor-pointer" />
                <FaSignOutAlt className="w-5 h-5 cursor-pointer" />
                <FaEllipsisV className="w-5 h-5 cursor-pointer" />
              </div>
            </div>

            {/* Page Content */}
<form
  className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 px-4 sm:px-0"
>
  <input
    type="text"
    placeholder="Name"
    className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
  />
  <input
    type="text"
    maxLength={10}
    placeholder="Roll No"
    className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
  />
  <input
    type="text"
    placeholder="CNIC"
    maxLength={15}
    className="col-span-1 sm:col-span-2 border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
  />
</form>

{/* Get Result Button */}
<div className="flex justify-center items-center gap-1 mt-3 px-4 sm:px-0">
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
    GET RESULT
  </button>
</div>

          </div>

          {/* User Footer */}
          <UserFooter />
        </div>
      </div>
    </>
  );
}
