"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaBell,
  FaSignOutAlt,
  FaEllipsisV,
  FaBars,
  FaTimes,
  FaCalendar,
} from "react-icons/fa";
import UserFooter from "@/app/components/UserFooter";

// ✅ UserCard Component
const UserCard = ({ name, date }: { name: string; date: string }) => (
  <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md mb-4">
    <div>
      <h2 className="text-xs sm:text-sm lg:text-lg font-bold">{name}</h2>
      <div className="flex items-center text-sm text-gray-600 mt-1">
        <FaCalendar className="w-4 h-4 mr-1 text-emerald-600" />
        {date}
      </div>
    </div>
    <div className="flex space-x-2">
      <button className="bg-black text-white px-3 py-2 sm:px-4 sm:py-3 rounded-md cursor-pointer font-poppins text-xs sm:text-sm">VIEW</button>
      <button className="bg-emerald-900 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-md cursor-pointer font-poppins text-xs sm:text-sm">EDIT</button>
    </div>
  </div>
);

export default function Applications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const users = [
    { name: "AHAD RAZA", date: "02/02/25" },
    { name: "MUNEEB KHAN", date: "02/02/25" },
    { name: "AHIL RIAZ", date: "02/02/25" },
    { name: "MUBASHIR ABAS", date: "02/02/25" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden font-sans">
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
        <h1 className="text-lg font-bold">USER APPLICATIONS</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#004432] text-white p-6 flex flex-col absolute md:relative top-0 left-0 h-full md:h-auto z-50`}
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
      <div className="flex-1 flex flex-col overflow-x-hidden bg-gray-100">
        {/* Top Bar for Desktop */}
        <div className="hidden md:flex justify-between items-center bg-[#dad5cf] shadow p-4">
          <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">
            USER APPLICATIONS
          </h1>
          <div className="flex items-center space-x-4 text-gray-700">
            <FaBell className="w-5 h-5 cursor-pointer" />
            <FaSignOutAlt className="w-5 h-5 cursor-pointer" />
            <FaEllipsisV className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* Content Section (flex-1 ensures it fills space) */}
        <div className="flex-1 p-6 max-w-3xl w-full mx-auto">
          {users.map((user, idx) => (
            <UserCard key={idx} name={user.name} date={user.date} />
          ))}
        </div>

        {/* Footer at the bottom */}
        <UserFooter />
      </div>
    </div>
  );
}
