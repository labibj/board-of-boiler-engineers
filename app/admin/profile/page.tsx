"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes  } from "react-icons/fa";
import AdminFooter from "@/app/components/AdminFooter";
export default function Profile() {
const [sidebarOpen, setSidebarOpen] = useState(false);
return (
<div className="flex flex-col md:flex-row min-h-screen font-sans">
  {/* Mobile Topbar */}
  <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
    <h1 className="text-lg font-bold">Profile</h1>
    <button onClick={() =>
      setSidebarOpen(!sidebarOpen)}>
      {sidebarOpen ? 
      <FaTimes size={20} />
      : 
      <FaBars size={20} />
      }
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
    <button onClick={() =>
      setSidebarOpen(false)}>
      <FaTimes size={20} />
    </button>
  </div>
  {/* Logo */}
  <div className="flex flex-col items-center mb-8">
    <Link href="/admin/dashboard">
    <Image src="/dashboard-logo.png" alt="Dashboard Logo" width={130} height={70} />
    </Link>
    <h5 className="lg:text-base md:text-base text-sm font-bold text-center">
      BOARD OF EXAMINATION
    </h5>
    <h6 className="text-[#258c71] font-nato text-sm">(FOR BOILER ENGINEERS)</h6>
  </div>
  {/* Navigation */}
  <nav className="flex flex-col space-y-4 w-full">
    {/* Dashboard */}
    <Link href="/admin/dashboard" className="flex items-center space-x-3 hover:text-gray-300">
    <Image src="/dashboard-icon.png" alt="Dashboard Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Dashboard</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Profile */}
    <Link href="/admin/profile/" className="flex items-center space-x-3 hover:text-gray-300">
    <Image src="/profile-icon.png" alt="Profile Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Profile</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Applications */}
    <Link href="/admin/applications/" className="flex items-center space-x-3 hover:text-gray-300">
    <Image src="/application-icon.png" alt="Applications Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Applications</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Date Sheet */}
    <Link href="/admin/date-sheet/" className="flex items-center space-x-3 hover:text-gray-300">
    <Image src="/datesheet-icon.png" alt="Date Sheet Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Date Sheet</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Result */}
    <Link href="/admin/result-management/" className="flex items-center space-x-3 hover:text-gray-300">
    <Image src="/result-icon.png" alt="Result Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Result</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Fee Structure */}
    <Link href="/admin/fee-structure/" className="flex items-center space-x-3 hover:text-gray-300 mt-4">
    <Image src="/logout-icon.png" alt="Logout Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Fee Structure</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Add User */}
    <Link href="/admin/add-new-user" className="flex items-center space-x-3 hover:text-gray-300 mt-4">
    <Image src="/logout-icon.png" alt="Logout Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Add New User</span>
    </Link>
  </nav>
  </aside>
  {/* Main Content */}
  <div className="flex-1 flex flex-col grow">
    {/* Top Bar for Desktop */}
    <div className="hidden md:flex justify-between items-center bg-[#dad5cf] shadow p-4">
      <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">Profile</h1>
      <div className="flex items-center space-x-4 text-gray-700">
        <FaBell className="w-5 h-5 cursor-pointer" />
        <FaSignOutAlt className="w-5 h-5 cursor-pointer" />
        <FaEllipsisV className="w-5 h-5 cursor-pointer" />
      </div>
    </div>
    {/* Page Content */}
    {/* Section Personal Data Form */}
    <section className="w-full mx-auto p-12 flex grow">
      <div className="flex w-full">
        <div className="w-3/12 text-center flex flex-col gap-3">
          <div className="rounded overflow-hidden shadow relative">
            <Image src="/user-img.png" alt="User Image" width={251} height={262} className="w-full rounded" />
            <div className="absolute left-0 bottom-2 right-0 z-10 text-center">
              12 x 12
            </div>
          </div>
          <Link href="" className="text-[#004432] underline">
            Change Photo
          </Link>
        </div>
        <div className="w-9/12 pl-6">
      <form className="space-y-6 w-full">        
        {/* Row 2: Name input fields with labels */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="fullName" className="block mb-1 font-semibold text-gray-700">NAME</label>
            <input
              type="text"
              id="fullName"
              className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
          </div>
          <div>
            <label htmlFor="fullName" className="block mb-1 font-semibold text-gray-700">FATHER NAME</label>
            <input
              type="text"
              id="fullName"
              className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">EMAIL</label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
          </div>
        </div>
        {/* Row 3: Password and Mobile Number */}
        <div className="grid grid-cols-1">
          <div>
            <label htmlFor="tel" className="block mb-1 font-semibold text-gray-700">Phone #</label>
            <input
              type="tel"
              id="tel"
              className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
          </div>
        </div>
      </form>

        </div>
      </div>
    </section>
    {/* Admin Footer */}
    <AdminFooter />
  </div>
</div>
);
}