"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes, FaCalendarAlt  } from "react-icons/fa";
import AdminFooter from "@/app/components/AdminFooter";
export default function AddNewUser() {
const [sidebarOpen, setSidebarOpen] = useState(false);
return (
<div className="flex flex-col md:flex-row min-h-screen font-sans">
  {/* Mobile Topbar */}
  <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
    <h1 className="text-lg font-bold">Applications</h1>
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
      <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">Applications</h1>
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
        {/* Row 1: Two selectors with labels */}
        <div className="grid grid-cols-1">
          <div>
            <label htmlFor="" className="block mb-1 font-semibold text-gray-700">SORT BY</label>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
              <select id="selector1" className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]">
                <option value="">3rd Class</option>
                <option value="option1">1</option>
                <option value="option2">2</option>
              </select>
              <select id="selector1" className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]">
                <option value="">Section</option>
                <option value="option1">1</option>
                <option value="option2">2</option>
              </select>
              <select id="selector1" className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]">
                <option value="">Status</option>
                <option value="option1">1</option>
                <option value="option2">2</option>
              </select>
            </div>
          </div>
        </div>
        {/* Row 3: Applications */}
        <div className="flex p-3 border border-blue-600 rounded-2xl shadow-lg">
          <div className="lg:w-6/12 w-full">
            <div className="user-name text-xl">Mueeb Khan</div>
            <div className="date text-xs flex gap-2 items-center">
              <FaCalendarAlt /> 02/02/2025
            </div>
          </div>
          <div className="lg:w-6/12 w-full flex gap-3 justify-end">
            <button className="border-0 bg-[#004432] text-white rounded px-5">ACCEPT</button>
            <button className="border-0 bg-black text-white rounded px-5">CANCEL</button>
            <button className="border-0 bg-gray-600 text-white rounded px-5">HOLD</button>
          </div>
        </div>
        {/* Row 3: Applications */}
        <div className="flex p-3 border border-blue-600 rounded-2xl shadow-lg">
          <div className="lg:w-6/12 w-full">
            <div className="user-name text-xl">Mueeb Khan</div>
            <div className="date text-xs flex gap-2 items-center">
              <FaCalendarAlt /> 02/02/2025
            </div>
          </div>
          <div className="lg:w-6/12 w-full flex gap-3 justify-end">
            <button className="border-0 bg-[#004432] text-white rounded px-5">ACCEPT</button>
            <button className="border-0 bg-black text-white rounded px-5">CANCEL</button>
            <button className="border-0 bg-gray-600 text-white rounded px-5">HOLD</button>
          </div>
        </div>
        {/* Row 3: Applications */}
        <div className="flex p-3 border border-blue-600 rounded-2xl shadow-lg">
          <div className="lg:w-6/12 w-full">
            <div className="user-name text-xl">Mueeb Khan</div>
            <div className="date text-xs flex gap-2 items-center">
              <FaCalendarAlt /> 02/02/2025
            </div>
          </div>
          <div className="lg:w-6/12 w-full flex gap-3 justify-end">
            <button className="border-0 bg-[#004432] text-white rounded px-5">ACCEPT</button>
            <button className="border-0 bg-black text-white rounded px-5">CANCEL</button>
            <button className="border-0 bg-gray-600 text-white rounded px-5">HOLD</button>
          </div>
        </div>
      </form>
    </section>
    {/* Admin Footer */}
    <AdminFooter />
  </div>
</div>
);
}