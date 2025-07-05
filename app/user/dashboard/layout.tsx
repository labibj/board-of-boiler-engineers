"use client";

import React, { useState } from "react";
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
  FaFileAlt,
  FaFileInvoiceDollar,
  FaIdBadge,
  FaRegCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import UserFooter from "@/app/components/UserFooter";

export default function DashboardLayout() {
  useAuthRedirect(); // 👈 Ensures user is logged in
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
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Desktop Top Bar */}
        <div className="hidden md:flex justify-between items-center bg-[#dad5cf] shadow p-4">
          <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">
            USER DASHBOARD
          </h1>
          <div className="flex items-center space-x-4 text-gray-700">
            <FaBell className="w-5 h-5 cursor-pointer" />
            <FaSignOutAlt className="w-5 h-5 cursor-pointer" onClick={() => handleLogout("/user/login")} />
            <FaEllipsisV className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* Dashboard Cards */}
        <section className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FaFileAlt,
                label: "APPLICATIONS",
                href: "/user/applications",
              },
              {
                icon: FaIdBadge,
                label: "ROLL NO SLIP",
                href: "/user/dashboard/",
              },
              {
                icon: FaFileInvoiceDollar,
                label: "FEE CHALLAN",
                href: "/user/dashboard/",
              },
              {
                icon: FaRegCalendarAlt,
                label: "DATE SHEET",
                href: "/user/dashboard/",
              },
              {
                icon: FaCheckCircle,
                label: "RESULT",
                href: "/user/results",
              },
              {
                icon: FaSignOutAlt,
                label: "LOGOUT", // logout action here
              },
            ].map(({ icon: Icon, label, href }, i) => (
              <div
                key={i}
                className="bg-[#258c71] text-white flex flex-col items-center justify-center rounded-tl-lg rounded-br-lg 
                  w-full h-40 sm:h-48 md:h-56 lg:h-60 p-4 gap-3"
              >
                {label === "LOGOUT" ? (
                  <button onClick={() => handleLogout("/user/login")}>
                    <Icon className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />
                  </button>
                ) : (
                  <Link href={href!}>
                    <Icon className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />
                  </Link>
                )}
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
