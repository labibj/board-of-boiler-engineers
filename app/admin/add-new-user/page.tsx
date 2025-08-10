"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes  } from "react-icons/fa";
import AdminFooter from "@/app/components/AdminFooter";

// Define the shape of the form data
interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string; // e.g., 'user', 'admin'
}

// Define response types for the simulated API call
interface SuccessResponse {
  success: true;
  user: { id: number; name: string; email: string; password: string; role: string; };
}

interface ErrorResponse {
  success: false;
  error: string;
}

type SimulatedApiResponse = SuccessResponse | ErrorResponse;


export default function AddNewUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "user", // Default role
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Handle input changes for the form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setLoading(true);

    // Basic client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setMessage({ type: 'error', text: "All fields are required." });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: "Password must be at least 6 characters long." });
      setLoading(false);
      return;
    }

    try {
      // Simulate network request delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate a response using the new union type
      // You can toggle between success and error by commenting/uncommenting
      const simulatedResponse: SimulatedApiResponse = { success: true, user: { id: Date.now(), ...formData } };
      // const simulatedResponse: SimulatedApiResponse = { success: false, error: "User with this email already exists." };


      if (simulatedResponse.success) {
        setMessage({ type: 'success', text: "Sub-user created successfully!" });
        setFormData({ name: "", email: "", password: "", role: "user" }); // Clear form
      } else {
        // Explicitly assert the type to ErrorResponse when success is false
        setMessage({ type: 'error', text: (simulatedResponse as ErrorResponse).error });
      }
    } catch (apiError) {
      console.error("Error creating sub-user:", apiError);
      setMessage({ type: 'error', text: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans">
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
        <h1 className="text-lg font-bold">Add New User</h1>
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
          <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">Add New User</h1>
          <div className="flex items-center space-x-4 text-gray-700">
            <FaBell className="w-5 h-5 cursor-pointer" />
            <FaSignOutAlt className="w-5 h-5 cursor-pointer" />
            <FaEllipsisV className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* Page Content */}
        <section className="w-full mx-auto p-12 flex grow items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-[#004432] mb-6">Create New Sub-User</h2>

            {/* Display Messages */}
            {message && (
              <div className={`p-3 rounded-md mb-4 text-center ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#004432] focus:ring focus:ring-[#004432] focus:ring-opacity-50 p-2"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#004432] focus:ring focus:ring-[#004432] focus:ring-opacity-50 p-2"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#004432] focus:ring focus:ring-[#004432] focus:ring-opacity-50 p-2"
                  required
                />
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#004432] focus:ring focus:ring-[#004432] focus:ring-opacity-50 p-2"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#004432] hover:bg-[#003522]'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004432]`}
                disabled={loading}
              >
                {loading ? "Creating User..." : "Create User"}
              </button>
            </form>
          </div>
        </section>

        {/* Admin Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}
