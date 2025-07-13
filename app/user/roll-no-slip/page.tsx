"use client";
import React, { useState, useEffect } from "react"; // Import useEffect
import { sidebarLinks } from "@/app/data/sidebarLinks";
import { handleLogout } from "@/app/utils/logout";
import useAuthRedirect from "@/app/hooks/useAuthRedirect";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes } from "react-icons/fa";
import UserFooter from "@/app/components/UserFooter";

export default function RollNoSlipUser() { // Renamed component to follow PascalCase
  useAuthRedirect(); // 👈 Ensures user is logged in
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rollNoSlipUrl, setRollNoSlipUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Function to fetch the user's roll number slip URL
  const fetchRollNoSlip = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/user/roll-no-slip", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        if (data.rollNoSlipUrl) {
          setRollNoSlipUrl(data.rollNoSlipUrl);
          setMessage("✅ Your Roll No Slip is available.");
        } else {
          setRollNoSlipUrl(null);
          setMessage("ℹ️ No roll number slip has been uploaded for you yet.");
        }
      } else {
        setMessage(`❌ Failed to load roll number slip: ${data.error || 'Unknown error'}`);
        console.error("Failed to fetch roll number slip:", data);
      }
    } catch (err) {
      console.error("Fetch roll no slip error:", err);
      setMessage("❌ An error occurred while fetching your roll number slip.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch roll number slip on component mount
  useEffect(() => {
    fetchRollNoSlip();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen font-sans">
        {/* Mobile Topbar */}
        <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
          <h1 className="text-lg font-bold">ROLL NO SLIP</h1>
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
              <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">ROLL NO SLIP</h1>
              <div className="flex items-center space-x-4 text-gray-700">
                <FaBell className="w-5 h-5 cursor-pointer" />
                <FaSignOutAlt className="w-5 h-5 cursor-pointer" onClick={() => handleLogout("/user/login")} />
                <FaEllipsisV className="w-5 h-5 cursor-pointer" />
              </div>
            </div>

            {/* Page Content */}
            <section className="w-full mx-auto p-4 md:p-12 flex flex-col items-center justify-center grow">
              <h2 className="text-2xl font-bold text-[#004432] mb-6">Your Roll No Slip</h2>

              {loading ? (
                <p className="text-lg text-gray-600">Loading your roll number slip...</p>
              ) : (
                <>
                  {message && (
                    <p className={`mb-4 text-center ${message.startsWith('✅') ? 'text-green-600' : message.startsWith('ℹ️') ? 'text-blue-600' : 'text-red-600'}`}>
                      {message}
                    </p>
                  )}

                  {rollNoSlipUrl ? (
                    <div className="mt-4 text-center">
                      <a
                        href={rollNoSlipUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download Roll No Slip (PDF)
                      </a>
                    </div>
                  ) : (
                    <p className="text-lg text-gray-700">Please check back later or contact administration.</p>
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
