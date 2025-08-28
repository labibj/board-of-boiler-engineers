"use client";
import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes } from "react-icons/fa";
import AdminFooter from "@/app/components/AdminFooter";
import { useRouter } from "next/navigation"; // Import useRouter

// Define ApplicationData type for frontend
interface ApplicationData {
  _id: string;
  fullName: string;
  dob: string;
  status: "Pending" | "Accepted" | "Cancelled" | "Held";
  submittedAt: string; // Date will be string from JSON
  // Add other fields you want to display or use
}

// Define ApplicationStatus type for consistency with backend
type ApplicationStatus = "Pending" | "Accepted" | "Cancelled" | "Held";

export default function AdminApplications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationData[]>(
[]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All"); // For status filter
  const [sortOrder, setSortOrder] = useState<string>("newest"); // For sorting
  const router = useRouter();

  // Memoize fetchApplications using useCallback
  const fetchApplications = useCallback(async (statusFilter: string = "All") => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setMessage("Admin not authenticated. Redirecting to login.");
        router.replace("/admin/login");
        return;
      }

      let url = "/api/admin/applications";
      if (statusFilter !== "All") {
        url += `?status=${statusFilter}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        // setApplications(data.applications);
        setApplications([
  {
    _id: "654321abcdef01234567890",
    fullName: "Alice Smith",
    dob: "1995-03-15",
    submittedAt: "2025-07-20T10:30:00Z", 
    status: "Pending", 
  },
  {
    _id: "987654fedcba9876543210fe",
    fullName: "Bob Johnson",
    dob: "1990-11-22",
    submittedAt: "2025-06-01T14:00:00Z",
    status: "Accepted",
  },
])
      } else {
        setMessage(`❌ Failed to load applications: ${data.error || 'Unknown error'}`);
        console.error("Failed to fetch applications:", data);
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin/login"); // Redirect on auth failure
        }
      }
    } catch (err) {
      console.error("Fetch applications error:", err);
      setMessage("❌ An error occurred while loading applications.");
    } finally {
      setLoading(false);
    }
  }, [router]); // Dependencies for useCallback: router is used inside.

  // Fetch applications on component mount and when filterStatus or fetchApplications changes
  useEffect(() => {
    fetchApplications(filterStatus);
  }, [fetchApplications, filterStatus]);




   // Now, fetchApplications is a stable dependency. filterStatus is still needed because the effect needs to re-run when filterStatus changes.

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    setMessage("");
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setMessage("Admin not authenticated. Redirecting to login.");
        router.replace("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/applications", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Application status updated to ${newStatus}.`);
        fetchApplications(filterStatus);
      } else {
        setMessage(`❌ Failed to update status: ${data.error || data.message || 'Unknown error'}`);
        console.error("Status update error:", data);
      }
    } catch (err) {
      console.error("Status update network error:", err);
      setMessage("❌ An error occurred while updating status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token"); // Clear token
    router.replace("/admin/login"); // Redirect to admin login
  };

  // Sort applications based on sortOrder state
  const sortedApplications = [...applications].sort((a, b) => {
    const dateA = new Date(a.submittedAt).getTime();
    const dateB = new Date(b.submittedAt).getTime();
    if (sortOrder === "newest") {
      return dateB - dateA;
    } else { // oldest
      return dateA - dateB;
    }
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans">
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
        <h1 className="text-lg font-bold">Applications</h1>
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
          {/* Roll No Slip */}
          <Link href="/admin/roll-no-slip/" className="flex items-center space-x-3 hover:text-gray-300">
            <Image src="/logout-icon.png" alt="Roll No Slip Icon" width={20} height={20} /> {/* Placeholder icon */}
            <span className="font-semibold tracking-wide">Roll No Slip</span>
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
            <FaSignOutAlt className="w-5 h-5 cursor-pointer" onClick={handleLogout} />
            <FaEllipsisV className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
        {/* Page Content */}
        <section className="w-full mx-auto p-4 md:p-12 flex flex-col grow">
          <h2 className="text-2xl font-bold text-[#004432] mb-6">Submitted Applications</h2>

          {message && (
            <p className={`mb-4 text-center ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full sm:w-1/2">
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status:
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004432]"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Held">Held</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                Sort by Date:
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004432]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-lg text-gray-600 text-center">Loading applications...</p>
          ) : sortedApplications.length === 0 ? (
            <p className="text-lg text-gray-700 text-center">No applications found.</p>
          ) : (
            <div className="space-y-4">
              {sortedApplications.map((app) => (
                <div key={app._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1 mb-2 md:mb-0">
                    <h3 className="text-lg font-semibold text-[#004432]">{app.fullName}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">DOB:</span> {app.dob}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Submitted:</span> {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
                    <p className={`text-sm font-semibold ${
                      app.status === 'Accepted' ? 'text-green-600' :
                      app.status === 'Pending' ? 'text-yellow-600' :
                      app.status === 'Held' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      Status: {app.status}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleStatusUpdate(app._id, "Accepted")}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={app.status === "Accepted"}
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, "Cancelled")}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={app.status === "Cancelled"}
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, "Held")}
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={app.status === "Held"}
                    >
                      HOLD
                    </button>
                  </div>
                </div>
              ))}
            </div>
           )}
        </section>
        {/* Admin Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}
