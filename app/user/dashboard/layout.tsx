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
  FaFileAlt,
  FaFileInvoiceDollar,
  FaIdBadge,
  FaRegCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import UserFooter from "@/app/components/UserFooter";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans overflow-x-hidden">
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
        <h1 className="text-lg font-bold">USER DASHBOARD</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#004432] text-white p-6 flex flex-col z-50 absolute md:relative top-0 left-0 h-screen md:h-auto overflow-y-auto`}
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
          <Link
            href="/user/dashboard"
            className="flex items-center space-x-3 hover:text-gray-300"
          >
            <Image
              src="/dashboard-icon.png"
              alt="Dashboard Icon"
              width={20}
              height={20}
            />
            <span className="font-semibold tracking-wide">Dashboard</span>
          </Link>
          <hr className="border-t border-white w-full" />

          <Link
            href="/user/profile/"
            className="flex items-center space-x-3 hover:text-gray-300"
          >
            <Image
              src="/profile-icon.png"
              alt="Profile Icon"
              width={20}
              height={20}
            />
            <span className="font-semibold tracking-wide">Profile</span>
          </Link>
          <hr className="border-t border-white w-full" />

          <Link
            href="/user/applications/"
            className="flex items-center space-x-3 hover:text-gray-300"
          >
            <Image
              src="/application-icon.png"
              alt="Applications Icon"
              width={20}
              height={20}
            />
            <span className="font-semibold tracking-wide">Applications</span>
          </Link>
          <hr className="border-t border-white w-full" />

          <Link
            href="/user/dashboard/"
            className="flex items-center space-x-3 hover:text-gray-300"
          >
            <Image
              src="/datesheet-icon.png"
              alt="Date Sheet Icon"
              width={20}
              height={20}
            />
            <span className="font-semibold tracking-wide">Date Sheet</span>
          </Link>
          <hr className="border-t border-white w-full" />

          <Link
            href="/user/results"
            className="flex items-center space-x-3 hover:text-gray-300"
          >
            <Image
              src="/result-icon.png"
              alt="Result Icon"
              width={20}
              height={20}
            />
            <span className="font-semibold tracking-wide">Result</span>
          </Link>
          <hr className="border-t border-white w-full" />

          <Link
            href="/logout"
            className="flex items-center space-x-3 hover:text-gray-300 mt-4"
          >
            <Image
              src="/logout-icon.png"
              alt="Logout Icon"
              width={20}
              height={20}
            />
            <span className="font-semibold tracking-wide">Logout</span>
          </Link>
          <hr className="border-t border-white w-full" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Desktop Top Bar */}
        <div className="hidden md:flex justify-between items-center bg-[#dad5cf] shadow p-4">
          <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">
            USER DASHBOARD
          </h1>
          <div className="flex items-center space-x-4 text-gray-700">
            <FaBell className="w-5 h-5 cursor-pointer" />
            <FaSignOutAlt className="w-5 h-5 cursor-pointer" />
            <FaEllipsisV className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* Page Content */}
        <section className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Cards - Responsive */}
            {[
              { icon: FaFileAlt, label: "APPLICATIONS", href: "/user/applications" },
              { icon: FaIdBadge, label: "ROLL NO SLIP", href: "/user/dashboard/" },
              { icon: FaFileInvoiceDollar, label: "FEE CHALLAN", href: "/user/dashboard/" },
              { icon: FaRegCalendarAlt, label: "DATE SHEET", href: "/user/dashboard/" },
              { icon: FaCheckCircle, label: "RESULT", href: "/user/results" },
              { icon: FaSignOutAlt, label: "LOGOUT", href: "/user/dashboard/" },
            ].map(({ icon: Icon, label, href }, i) => (
              <div
                key={i}
                className="bg-[#258c71] text-white flex flex-col items-center justify-center rounded-tl-lg rounded-br-lg 
                  w-full h-40 sm:h-48 md:h-56 lg:h-60 p-4 gap-3"
              >
                <Link href={href}>
                  <Icon className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />
                </Link>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center">
                  {label}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <UserFooter />
      </div>
    </div>
  );
}
