"use client";
import React, { useState, useEffect } from "react";
import { sidebarLinks } from "@/app/data/sidebarLinks";
import { handleLogout } from "@/app/utils/logout";
import useAuthRedirect from "@/app/hooks/useAuthRedirect";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes } from "react-icons/fa";
import UserFooter from "@/app/components/UserFooter";
import UserHeader from "@/app/components/UserHeader";

// Define ApplicationData type for frontend, matching lib/models/application.ts
interface ApplicationData {
  _id: string;
  fullName: string;
  dob: string;
  status: "Pending" | "Accepted" | "Cancelled" | "Held";
  submittedAt: string; // Date will be string from JSON
  // Add other fields you want to display to the user, e.g., certificate, email, etc.
  certificate?: string;
  email?: string;
  frontIdCard?: string | null;
}

export default function UserApplicationsPage() {
  useAuthRedirect(); // Ensures user is logged in
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchUserApplication = async () => {
    setLoading(true);
    setMessage(""); // Clear previous messages
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      // NEW: Fetch from the userId-based API
      const res = await fetch("/api/user/applications", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        if (data.application) {
          setApplication(data.application);
          setMessage(`✅ Application loaded successfully.`);
        } else {
          setApplication(null); // Explicitly set to null if no application
          setMessage("ℹ️ You have not submitted an application yet.");
        }
      } else {
        setMessage(`❌ Failed to load application status: ${data.error || 'Unknown error'}`);
        console.error("Failed to fetch user application:", data);
        setApplication(null); // Ensure application is null on error
      }
    } catch (err) {
      console.error("Fetch user application error:", err);
      setMessage("❌ An error occurred while fetching your application status.");
      setApplication(null); // Ensure application is null on network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserApplication();
  }, []); // Empty dependency array to run once on mount

  return (
    <>
      <UserHeader />
      <div className="flex flex-col md:flex-row min-h-screen font-sans">
        {/* Mobile Topbar */}
        <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
          <h1 className="text-lg font-bold">MY APPLICATIONS</h1>
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
        <div className="flex-1 flex flex-col justify-between min-h-screen">
          <div>
            {/* Top Bar for Desktop */}
            <div className="hidden md:flex justify-between items-center bg-[#dad5cf] shadow p-4">
              <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">MY APPLICATIONS</h1>
              <div className="flex items-center space-x-4 text-gray-700">
                <FaBell className="w-5 h-5 cursor-pointer" />
                <FaSignOutAlt className="w-5 h-5 cursor-pointer" onClick={() => handleLogout("/user/login")} />
                <FaEllipsisV className="w-5 h-5 cursor-pointer" />
              </div>
            </div>

            {/* Page Content */}
            <section className="w-full mx-auto p-4 md:p-12 flex flex-col items-center justify-center grow">
              <h2 className="text-2xl font-bold text-[#004432] mb-6">Your Application Status</h2>

              {loading ? (
                <p className="text-lg text-gray-600">Loading your application status...</p>
              ) : (
                <>
                  {message && (
                    <p className={`mb-4 text-center ${message.startsWith('✅') ? 'text-green-600' : message.startsWith('ℹ️') ? 'text-blue-600' : 'text-red-600'}`}>
                      {message}
                    </p>
                  )}

                  {application ? (
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-md text-center">
                      <h3 className="text-xl font-semibold text-[#004432] mb-3">{application.fullName}</h3>
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Date of Birth:</span> {application.dob}
                      </p>
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Submitted On:</span> {new Date(application.submittedAt).toLocaleDateString()}
                      </p>
                      <p className={`text-xl font-bold ${
                        application.status === 'Accepted' ? 'text-green-600' :
                        application.status === 'Pending' ? 'text-yellow-600' :
                        application.status === 'Held' ? 'text-orange-600' :
                        'text-red-600'
                      } mt-4`}>
                        Status: {application.status}
                      </p>
                      {application.status === "Accepted" && (
                        <p className="text-sm text-gray-500 mt-2">
                          Your application has been accepted. You can check the Roll No Slip page for your slip.
                        </p>
                      )}
                      {application.status === "Cancelled" && (
                        <p className="text-sm text-gray-500 mt-2">
                          Your application has been cancelled. Please contact administration for details.
                        </p>
                      )}
                      {application.status === "Held" && (
                        <p className="text-sm text-gray-500 mt-2">
                          Your application is currently on hold. Please await further instructions.
                        </p>
                      )}
                    </div>
                  ) : (
                    // This block is shown when no application is submitted
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-md text-center">
                        <p className="text-lg text-gray-700 mb-4">You have not submitted an application yet.</p>
                        <Link href="/user/application-submission-process">
                            <button className="bg-[#004432] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#003522] transition">
                                Submit New Application
                            </button>
                        </Link>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* User Footer */}
          <UserFooter />
        </div>
      </div>
    </>
  );
}
