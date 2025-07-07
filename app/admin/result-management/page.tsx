"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes } from "react-icons/fa";
import AdminFooter from "@/app/components/AdminFooter";

// Define the type for a single result item, matching the backend ResultData interface
interface ResultItem {
  _id: string; // MongoDB ObjectId as string
  rollNumber: string;
  candidateName: string;
  certificate: string;
  dateOfExam: string;
  paper1Marks: string;
  paper2Marks: string;
  paper3Marks: string;
  totalMarks: string;
  resultStatus: string;
  remarks: string;
  uploadedAt: string; // Date will be stringified from backend
  originalFileName: string;
  cloudinaryUrl: string;
}

export default function ResultManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch results from the backend
  const fetchResults = async () => {
    setLoadingResults(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoadingResults(false);
        return;
      }

      const res = await fetch("/api/admin/results", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setResults(data.data || []);
      } else {
        setError(data.error || "Failed to fetch results.");
        console.error("Failed to fetch results:", data);
      }
    } catch (err) {
      setError("An error occurred while fetching results.");
      console.error("Fetch results error:", err);
    } finally {
      setLoadingResults(false);
    }
  };

  // Fetch results on component mount
  useEffect(() => {
    fetchResults();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token not found. Please log in.");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("resultFile", selectedFile); // 'resultFile' matches the backend expected field name

      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Results uploaded successfully!");
        setSelectedFile(null); // Clear selected file
        fetchResults(); // Refresh results table
      } else {
        setError(data.error || "Failed to upload results.");
        console.error("Upload failed:", data);
      }
    } catch (err) {
      setError("An error occurred during upload.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadCsv = () => {
    if (results.length === 0) {
      alert("No results to download.");
      return;
    }

    // Create CSV content from current results data
    const headers = [
      "Roll Number", "Candidate Name", "Certificate", "Date of Exam",
      "Paper 1 Marks", "Paper 2 Marks", "Paper 3 Marks", "Total Marks",
      "Result Status", "Remarks", "Uploaded At", "Original File Name", "Cloudinary URL"
    ];
    const rows = results.map(row => [
      row.rollNumber, row.candidateName, row.certificate, row.dateOfExam,
      row.paper1Marks, row.paper2Marks, row.paper3Marks, row.totalMarks,
      row.resultStatus, row.remarks, row.uploadedAt, row.originalFileName, row.cloudinaryUrl
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) { // Feature detection for download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "results.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback for browsers that don't support download attribute
      alert("Your browser does not support direct download. Please copy the data manually.");
    }
  };


  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans">
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
        <h1 className="text-lg font-bold">Result Management</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ?
            <FaTimes size={20} />
            :
            <FaBars size={20} />
          }
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
          <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">Result Management</h1>
          <div className="flex items-center space-x-4 text-gray-700">
            <FaBell className="w-5 h-5 cursor-pointer" />
            <FaSignOutAlt className="w-5 h-5 cursor-pointer" />
            <FaEllipsisV className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
        {/* Page Content */}
        <section className="w-full mx-auto p-4 md:p-12 flex flex-col grow">
          <h2 className="text-2xl font-bold text-[#004432] mb-6">Upload & Manage Results</h2>

          {/* Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Upload New Result Sheet (CSV/Excel)</h3>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
                className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
              />
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className={`px-6 py-2 rounded-md font-semibold transition ${
                  !selectedFile || uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#004432] text-white hover:bg-[#003522]'
                }`}
              >
                {uploading ? "Uploading..." : "Upload Results"}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Results Display Section */}
          <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Current Results</h3>
              <button
                onClick={handleDownloadCsv}
                disabled={results.length === 0}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  results.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Download as CSV
              </button>
            </div>

            {loadingResults ? (
              <p className="text-center text-gray-600">Loading results...</p>
            ) : results.length === 0 ? (
              <p className="text-center text-gray-600">No results uploaded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 border-b border-gray-200">Roll No.</th>
                      <th className="py-3 px-6 border-b border-gray-200">Candidate Name</th>
                      <th className="py-3 px-6 border-b border-gray-200">Certificate</th>
                      <th className="py-3 px-6 border-b border-gray-200">Date of Exam</th>
                      <th className="py-3 px-6 border-b border-gray-200">Paper 1</th>
                      <th className="py-3 px-6 border-b border-gray-200">Paper 2</th>
                      <th className="py-3 px-6 border-b border-gray-200">Paper 3</th>
                      <th className="py-3 px-6 border-b border-gray-200">Total</th>
                      <th className="py-3 px-6 border-b border-gray-200">Status</th>
                      <th className="py-3 px-6 border-b border-gray-200">Remarks</th>
                      <th className="py-3 px-6 border-b border-gray-200">Uploaded At</th>
                      <th className="py-3 px-6 border-b border-gray-200">Original File</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm font-light">
                    {results.map((result) => (
                      <tr key={result._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 whitespace-nowrap">{result.rollNumber}</td>
                        <td className="py-3 px-6">{result.candidateName}</td>
                        <td className="py-3 px-6">{result.certificate}</td>
                        <td className="py-3 px-6">{result.dateOfExam}</td>
                        <td className="py-3 px-6">{result.paper1Marks}</td>
                        <td className="py-3 px-6">{result.paper2Marks}</td>
                        <td className="py-3 px-6">{result.paper3Marks}</td>
                        <td className="py-3 px-6">{result.totalMarks}</td>
                        <td className="py-3 px-6">{result.resultStatus}</td>
                        <td className="py-3 px-6">{result.remarks}</td>
                        <td className="py-3 px-6">{new Date(result.uploadedAt).toLocaleDateString()}</td>
                        <td className="py-3 px-6">
                            <a href={result.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {result.originalFileName}
                            </a>
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
