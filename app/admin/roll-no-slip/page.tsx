"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes } from "react-icons/fa";
import AdminFooter from "@/app/components/AdminFooter";

export default function RollNoSlipAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState(""); // State for CNIC/Email
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for PDF file
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!userIdentifier) {
      setMessage("❌ Please enter a user CNIC or Email.");
      setLoading(false);
      return;
    }
    if (!selectedFile) {
      setMessage("❌ Please select a roll number slip PDF file.");
      setLoading(false);
      return;
    }
    if (selectedFile.type !== "application/pdf") {
      setMessage("❌ Only PDF files are allowed for roll number slips.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token"); // Assuming admin token is in localStorage
    if (!token) {
      setMessage("❌ Admin not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("userIdentifier", userIdentifier);
    formData.append("rollNoSlipFile", selectedFile);

    try {
      const res = await fetch("/api/admin/roll-no-slip", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setUserIdentifier(""); // Clear form
        setSelectedFile(null); // Clear file input
        // You might want to refresh a list of users/slips here if you add one later
      } else {
        setMessage(`❌ ${data.error || data.message || 'Failed to upload roll number slip.'}`);
        console.error("Upload error:", data);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans">
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
        <h1 className="text-lg font-bold">Roll No Slip Management</h1>
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
          <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">Roll No Slip Management</h1>
          <div className="flex items-center space-x-4 text-gray-700">
            <FaBell className="w-5 h-5 cursor-pointer" />
            <FaSignOutAlt className="w-5 h-5 cursor-pointer" />
            <FaEllipsisV className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
        {/* Page Content */}
        <section className="w-full mx-auto p-4 md:p-12 flex flex-col grow">
          <h2 className="text-2xl font-bold text-[#004432] mb-6">Upload Roll No Slip for User</h2>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="userIdentifier" className="block text-sm font-medium text-gray-700 mb-1">
                  User CNIC or Email
                </label>
                <input
                  type="text"
                  id="userIdentifier"
                  value={userIdentifier}
                  onChange={(e) => setUserIdentifier(e.target.value)}
                  placeholder="Enter User's CNIC or Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004432]"
                  required
                />
              </div>
              <div>
                <label htmlFor="rollNoSlipFile" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Roll No Slip (PDF)
                </label>
                <input
                  type="file"
                  id="rollNoSlipFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004432]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-2 rounded-md font-semibold transition ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#004432] text-white hover:bg-[#003522]'
                }`}
              >
                {loading ? "Uploading..." : "Upload Roll No Slip"}
              </button>
            </form>
            {message && (
              <p className={`mt-4 text-center ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        </section>
        {/* Admin Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}
