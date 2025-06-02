"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes, FaFileAlt, FaFileInvoiceDollar, FaIdBadge, FaRegCalendarAlt, FaCheckCircle  } from "react-icons/fa";
import AdminFooter from "@/app/components/AdminFooter";
export default function AddNewUser() {
const [sidebarOpen, setSidebarOpen] = useState(false);
return (
<div className="flex flex-col md:flex-row min-h-screen font-sans">
  {/* Mobile Topbar */}
  <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
    <h1 className="text-lg font-bold">Login / Add Admin</h1>
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
    <Link href="/admin/dashboard/" className="flex items-center space-x-3 hover:text-gray-300">
    <Image src="/profile-icon.png" alt="Profile Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Profile</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Applications */}
    <Link href="/admin/dashboard/" className="flex items-center space-x-3 hover:text-gray-300">
    <Image src="/application-icon.png" alt="Applications Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Applications</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Date Sheet */}
    <Link href="/admin/dashboard/" className="flex items-center space-x-3 hover:text-gray-300">
    <Image src="/datesheet-icon.png" alt="Date Sheet Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Date Sheet</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Result */}
    <Link href="/admin/dashboard/" className="flex items-center space-x-3 hover:text-gray-300">
    <Image src="/result-icon.png" alt="Result Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Result</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Fee Structure */}
    <Link href="" className="flex items-center space-x-3 hover:text-gray-300 mt-4">
    <Image src="/logout-icon.png" alt="Logout Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Fee Structure</span>
    </Link>
    <hr className="border-t border-white w-full" />
    {/* Add User */}
    <Link href="" className="flex items-center space-x-3 hover:text-gray-300 mt-4">
    <Image src="/logout-icon.png" alt="Logout Icon" width={20} height={20} />
    <span className="font-semibold tracking-wide">Add User</span>
    </Link>
    <hr className="border-t border-white w-full" />
  </nav>
  </aside>
  {/* Main Content */}
  <div className="flex-1 flex flex-col grow">
    {/* Top Bar for Desktop */}
    <div className="hidden md:flex justify-between items-center bg-[#dad5cf] shadow p-4">
      <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">Login / Add Admin</h1>
      <div className="flex items-center space-x-4 text-gray-700">
        <FaBell className="w-5 h-5 cursor-pointer" />
        <FaSignOutAlt className="w-5 h-5 cursor-pointer" />
        <FaEllipsisV className="w-5 h-5 cursor-pointer" />
      </div>
    </div>
    {/* Page Content */}
    {/* Section Personal Data Form */}
    <section className="w-full mx-auto p-12 flex grow">
      <form className="space-y-6 w-full">        
        {/* Row 2: Name input fields with labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block mb-1 font-semibold text-gray-700">FULL NAME</label>
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
        {/* Row 1: Two selectors with labels */}
        <div className="grid grid-cols-1">
          <div>
            <label htmlFor="Certificate-now-required" className="block mb-1 font-semibold text-gray-700">USER TYPE</label>
            <select id="selector1" className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]">
              <option value="">Add User Type</option>
              <option value="option1">1</option>
              <option value="option2">2</option>
            </select>
          </div>
        </div>
        {/* Row 3: Password and Mobile Number */}
        <div className="grid grid-cols-1">
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">PASSWORD</label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
          </div>
        </div>
        
        {/* Row 10: Next Button centered with plus icon on left */}
        <div className="flex justify-start items-center">
          <button
            type="submit"
            className="flex cursor-pointer transition"
            >
          <span className="bg-black text-white rounded-tl-lg py-3 px-3 flex items-center justify-center">
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
          <span className="bg-[#004432] text-white rounded-br-lg flex justify-center items-center font-semibold hover:bg-[#003522] px-4">
          Register
          </span>
          </button>
        </div>
      </form>
    </section>
    {/* Admin Footer */}
    <AdminFooter />
  </div>
</div>
);
}