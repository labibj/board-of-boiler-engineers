"use client";
import React, { useState, useEffect } from "react";
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

// Define the shape of a user in the list (matching UserData from lib/models/user.ts)
interface UserInList {
  _id: string; // MongoDB ObjectId converted to string
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string; // Assuming timestamps are enabled in your Mongoose schema
}

// Define response types for the simulated API call
interface CreateUserSuccessResponse {
  success: true;
  message: string;
  user: { id: number; name: string; email: string; password: string; role: string; };
}

interface CreateUserErrorResponse {
  success: false;
  error: string;
}

type CreateUserApiResponse = CreateUserSuccessResponse | CreateUserErrorResponse;

interface FetchUsersSuccessResponse {
  success: true;
  users: UserInList[];
}

interface FetchUsersErrorResponse {
  success: false;
  error: string;
  details?: string;
}

type FetchUsersApiResponse = FetchUsersSuccessResponse | FetchUsersErrorResponse;


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

  // State for user list
  const [userList, setUserList] = useState<UserInList[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Function to fetch the list of users
  const fetchUserList = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const token = localStorage.getItem('admin_token'); // Assuming admin token is stored
      if (!token) {
        setUsersError("Admin not authenticated. Please log in.");
        setUsersLoading(false);
        return;
      }

      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result: FetchUsersApiResponse = await response.json();

      if (response.ok && result.success) {
        setUserList(result.users);
      } else {
        setUsersError((result as FetchUsersErrorResponse).error || "Failed to fetch users.");
      }
    } catch (err) {
      console.error("Error fetching user list:", err);
      setUsersError("Failed to connect to the server to fetch users.");
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUserList();
  }, []); // Empty dependency array means this runs once on mount

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
      const token = localStorage.getItem('admin_token'); // Get admin token for authorization
      if (!token) {
        setMessage({ type: 'error', text: "Admin not authenticated. Please log in again." });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/create-sub-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send authorization token
        },
        body: JSON.stringify(formData),
      });

      const result: CreateUserApiResponse = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: result.message });
        setFormData({ name: "", email: "", password: "", role: "user" }); // Clear form
        fetchUserList(); // Refresh the user list after successful creation
      } else {
        setMessage({ type: 'error', text: (result as CreateUserErrorResponse).error || "Failed to create sub-user." });
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
        <section className="w-full mx-auto p-12 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-8">
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

          {/* User List Section */}
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mt-8">
            <h2 className="text-2xl font-bold text-center text-[#004432] mb-6">Existing Users</h2>

            {usersLoading && (
              <div className="text-center text-gray-600">Loading users...</div>
            )}

            {usersError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{usersError}</span>
              </div>
            )}

            {!usersLoading && !usersError && userList.length === 0 && (
              <div className="text-center text-gray-600">No users found.</div>
            )}

            {!usersLoading && !usersError && userList.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userList.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Admin Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}
