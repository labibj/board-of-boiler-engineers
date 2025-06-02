"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes, FaFileAlt, FaFileInvoiceDollar, FaIdBadge, FaRegCalendarAlt, FaCheckCircle  } from "react-icons/fa";
import AdminFooter from "@/app/components/AdminFooter";


export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans">
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
        <h1 className="text-lg font-bold">Admin DASHBOARD</h1>
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

  {/* Logout */}
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
          <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">Admin DASHBOARD</h1>
          <div className="flex items-center space-x-4 text-gray-700">
            <FaBell className="w-5 h-5 cursor-pointer" />
            <FaSignOutAlt className="w-5 h-5 cursor-pointer" />
            <FaEllipsisV className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* Page Content */}
<section className="p-6">
  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">

    <div className="bg-[#258c71] text-white flex flex-col items-center justify-center rounded-tl-lg rounded-br-lg 
                    w-40 h-40 p-4 gap-3
                    sm:w-48 sm:h-48 sm:p-5
                    md:w-56 md:h-56 md:p-6
                    lg:w-80 lg:h-80 lg:p-10">
      <Link href="/admin/dashboard/applications">
        <FaFileAlt className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />
      </Link>
      <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold">APPLICATIONS</h3>
    </div>

    <div className="bg-[#258c71] text-white flex flex-col items-center justify-center rounded-tl-lg rounded-br-lg 
                    w-40 h-40 p-4 gap-3
                    sm:w-48 sm:h-48 sm:p-5
                    md:w-56 md:h-56 md:p-6
                    lg:w-80 lg:h-80 lg:p-10">
      <Link href="/admin/dashboard/">
        <FaIdBadge className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />
      </Link>
      <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold">ROLL NO SLIP</h3>
    </div>

    <div className="bg-[#258c71] text-white flex flex-col items-center justify-center rounded-tl-lg rounded-br-lg 
                    w-40 h-40 p-4 gap-3
                    sm:w-48 sm:h-48 sm:p-5
                    md:w-56 md:h-56 md:p-6
                    lg:w-80 lg:h-80 lg:p-10">
      <Link href="/admin/dashboard/">
        <FaFileInvoiceDollar className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />
      </Link>
      <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold">FEE CHALLAN</h3>
    </div>

    <div className="bg-[#258c71] text-white flex flex-col items-center justify-center rounded-tl-lg rounded-br-lg 
                    w-40 h-40 p-4 gap-3
                    sm:w-48 sm:h-48 sm:p-5
                    md:w-56 md:h-56 md:p-6
                    lg:w-80 lg:h-80 lg:p-10">
      <Link href="/admin/dashboard/">
        <FaRegCalendarAlt className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />
      </Link>
      <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold">DATE SHEET</h3>
    </div>

    <div className="bg-[#258c71] text-white flex flex-col items-center justify-center rounded-tl-lg rounded-br-lg 
                    w-40 h-40 p-4 gap-3
                    sm:w-48 sm:h-48 sm:p-5
                    md:w-56 md:h-56 md:p-6
                    lg:w-80 lg:h-80 lg:p-10">
      <Link href="/admin/dashboard/results">
        <FaCheckCircle className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />
      </Link>
      <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold">RESULT</h3>
    </div>

    <div className="bg-[#258c71] text-white flex flex-col items-center justify-center rounded-tl-lg rounded-br-lg 
                    w-40 h-40 p-4 gap-3
                    sm:w-48 sm:h-48 sm:p-5
                    md:w-56 md:h-56 md:p-6
                    lg:w-80 lg:h-80 lg:p-10">
      <Link href="/admin/dashboard/">
        <FaSignOutAlt className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />
      </Link>
      <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold">LOGOUT</h3>
    </div>

  </div>
</section>


{/* Admin Footer */}
<AdminFooter />
      </div>
    </div>
    
  );
}
