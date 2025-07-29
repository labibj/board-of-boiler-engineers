// "use client";
// import React, { useState, useEffect } from "react"; // Added useEffect
// import Link from "next/link";
// import Image from "next/image";
// import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes } from "react-icons/fa";
// import AdminFooter from "@/app/components/AdminFooter";
// // Assuming you have an admin logout utility
// import { handleLogout } from "@/app/utils/logout"; // Adjust path if necessary

// // Define max file size (12MB in bytes)
// const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12 MB

// export default function DateSheet() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [currentDateSheetUrl, setCurrentDateSheetUrl] = useState<string | null>(null); // To display current datesheet

//   // Dummy state for selectors (you might connect these to actual data/logic later)
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSession, setSelectedSession] = useState("");

//   // Function to fetch the current datesheet URL (if stored in DB)
//   // This would require a GET endpoint on the backend for datesheets
//   const fetchCurrentDateSheet = async () => {
//     try {
//       const token = localStorage.getItem("adminToken"); // Assuming admin token is stored here
//       if (!token) {
//         console.warn("Admin not authenticated. Cannot fetch current datesheet.");
//         return;
//       }

//       const res = await fetch("/api/admin/datesheet", { // New API endpoint to fetch datesheet
//         method: "GET",
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (res.ok && data.url) {
//         setCurrentDateSheetUrl(data.url);
//       } else {
//         setCurrentDateSheetUrl(null); // No datesheet found or error
//       }
//     } catch (error) {
//       console.error("Error fetching current datesheet:", error);
//       setCurrentDateSheetUrl(null);
//     }
//   };

//   useEffect(() => {
//     fetchCurrentDateSheet();
//   }, []); // Fetch on component mount


//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setMessage(""); // Clear previous messages

//     if (file) {
//       if (file.size > MAX_FILE_SIZE_BYTES) {
//         setMessage(`❌ File size exceeds the ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB limit.`);
//         e.target.value = ''; // Clear the file input
//         setSelectedFile(null);
//         return;
//       }
//       // Optional: Validate file type (e.g., only PDF or common image types)
//       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
//       if (!allowedTypes.includes(file.type)) {
//         setMessage(`❌ Invalid file type. Please upload a PDF or image (JPG, PNG, GIF).`);
//         e.target.value = '';
//         setSelectedFile(null);
//         return;
//       }

//       setSelectedFile(file);
//     } else {
//       setSelectedFile(null);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage("");
//     setUploading(true);

//     if (!selectedFile) {
//       setMessage("Please select a file to upload.");
//       setUploading(false);
//       return;
//     }

//     // Basic validation for class and session (optional, depending on your needs)
//     if (!selectedClass || !selectedSession) {
//         setMessage("Please select both Class and Session.");
//         setUploading(false);
//         return;
//     }

//     const formData = new FormData();
//     formData.append("datesheet", selectedFile);
//     formData.append("class", selectedClass); // Append class
//     formData.append("session", selectedSession); // Append session

//     const token = localStorage.getItem("adminToken"); // Assuming admin token is stored here
//     if (!token) {
//       setMessage("❌ Admin not authenticated. Please log in.");
//       setUploading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/admin/upload-datesheet", { // New API endpoint
//         method: "POST",
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setMessage(`✅ ${data.message || "Date sheet uploaded successfully!"}`);
//         setSelectedFile(null); // Clear the file input
//         setCurrentDateSheetUrl(data.url); // Update displayed URL
//         // Optionally, clear class/session selectors if you want a fresh start
//         // setSelectedClass("");
//         // setSelectedSession("");
//       } else {
//         setMessage(`❌ ${data.error || "Failed to upload date sheet."}`);
//         console.error("Upload error:", data);
//       }
//     } catch (err) {
//       console.error("Network or unexpected error:", err);
//       setMessage("❌ An unexpected error occurred during upload.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen font-sans">
//       {/* Mobile Topbar */}
//       <div className="md:hidden flex justify-between items-center bg-[#004432] text-white p-4">
//         <h1 className="text-lg font-bold">Date Sheet</h1>
//         <button onClick={() => setSidebarOpen(!sidebarOpen)}>
//           {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//         </button>
//       </div>
//       {/* Sidebar */}
//       <aside
//         className={`${
//           sidebarOpen ? "block" : "hidden"
//         } md:block w-full md:w-64 bg-[#004432] text-white p-6 flex flex-col z-50 absolute md:relative top-0 left-0 h-full md:h-auto overflow-y-auto`}
//       >
//         {/* Mobile Close Button inside sidebar */}
//         <div className="flex justify-end mb-4 md:hidden">
//           <button onClick={() => setSidebarOpen(false)}>
//             <FaTimes size={20} />
//           </button>
//         </div>
//         {/* Logo */}
//         <div className="flex flex-col items-center mb-8">
//           <Link href="/admin/dashboard">
//             <Image src="/dashboard-logo.png" alt="Dashboard Logo" width={130} height={70} />
//           </Link>
//           <h5 className="lg:text-base md:text-base text-sm font-bold text-center">
//             BOARD OF EXAMINATION
//           </h5>
//           <h6 className="text-[#258c71] font-nato text-sm">(FOR BOILER ENGINEERS)</h6>
//         </div>
//         {/* Navigation */}
//         <nav className="flex flex-col space-y-4 w-full">
//           {/* Dashboard */}
//           <Link href="/admin/dashboard" className="flex items-center space-x-3 hover:text-gray-300">
//             <Image src="/dashboard-icon.png" alt="Dashboard Icon" width={20} height={20} />
//             <span className="font-semibold tracking-wide">Dashboard</span>
//           </Link>
//           <hr className="border-t border-white w-full" />
//           {/* Profile */}
//           <Link href="/admin/profile/" className="flex items-center space-x-3 hover:text-gray-300">
//             <Image src="/profile-icon.png" alt="Profile Icon" width={20} height={20} />
//             <span className="font-semibold tracking-wide">Profile</span>
//           </Link>
//           <hr className="border-t border-white w-full" />
//           {/* Applications */}
//           <Link href="/admin/applications/" className="flex items-center space-x-3 hover:text-gray-300">
//             <Image src="/application-icon.png" alt="Applications Icon" width={20} height={20} />
//             <span className="font-semibold tracking-wide">Applications</span>
//           </Link>
//           <hr className="border-t border-white w-full" />
//           {/* Date Sheet */}
//           <Link href="/admin/date-sheet/" className="flex items-center space-x-3 hover:text-gray-300 bg-[#003522] rounded-md py-2 px-3"> {/* Highlight active link */}
//             <Image src="/datesheet-icon.png" alt="Date Sheet Icon" width={20} height={20} />
//             <span className="font-semibold tracking-wide">Date Sheet</span>
//           </Link>
//           <hr className="border-t border-white w-full" />
//           {/* Result */}
//           <Link href="/admin/result-management/" className="flex items-center space-x-3 hover:text-gray-300">
//             <Image src="/result-icon.png" alt="Result Icon" width={20} height={20} />
//             <span className="font-semibold tracking-wide">Result</span>
//           </Link>
//           <hr className="border-t border-white w-full" />
//           {/* Fee Structure */}
//           <Link href="/admin/fee-structure/" className="flex items-center space-x-3 hover:text-gray-300">
//             <Image src="/logout-icon.png" alt="Logout Icon" width={20} height={20} />
//             <span className="font-semibold tracking-wide">Fee Structure</span>
//           </Link>
//           <hr className="border-t border-white w-full" />
//           {/* Add User */}
//           <Link href="/admin/add-new-user" className="flex items-center space-x-3 hover:text-gray-300">
//             <Image src="/logout-icon.png" alt="Logout Icon" width={20} height={20} />
//             <span className="font-semibold tracking-wide">Add New User</span>
//           </Link>
//         </nav>
//       </aside>
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col grow">
//         {/* Top Bar for Desktop */}
//         <div className="hidden md:flex justify-between items-center bg-[#dad5cf] shadow p-4">
//           <h1 className="lg:text-xl md:text-base font-semibold font-opan-sans">Date Sheet</h1>
//           <div className="flex items-center space-x-4 text-gray-700">
//             <FaBell className="w-5 h-5 cursor-pointer" />
//             <FaSignOutAlt className="w-5 h-5 cursor-pointer" onClick={() => handleLogout("/admin/login")} /> {/* Added logout handler */}
//             <FaEllipsisV className="w-5 h-5 cursor-pointer" />
//           </div>
//         </div>
//         {/* Page Content */}
//         {/* Section Personal Data Form */}
//         <section className="w-full mx-auto p-12 flex grow">
//           <form onSubmit={handleSubmit} className="space-y-6 w-full">
//             {/* Message Display */}
//             {message && (
//               <div className={`p-3 rounded-md text-center ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                 {message}
//               </div>
//             )}

//             {/* Row 1: Class Selector */}
//             <div className="grid grid-cols-1">
//               <div>
//                 <label htmlFor="classSelector" className="block mb-1 font-semibold text-gray-700">CLASS</label>
//                 <select
//                   id="classSelector"
//                   className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
//                   value={selectedClass}
//                   onChange={(e) => setSelectedClass(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Class</option>
//                   <option value="1st_class">1st Class</option>
//                   <option value="2nd_class">2nd Class</option>
//                   <option value="3rd_class">3rd Class</option>
//                 </select>
//               </div>
//             </div>
//             {/* Row 2: Session Selector & File Upload */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Changed to 2 columns for larger screens */}
//               <div>
//                 <label htmlFor="sessionSelector" className="block mb-1 font-semibold text-gray-700">SESSION</label> {/* Changed label from NORMAL FEE */}
//                 <select
//                   id="sessionSelector"
//                   className="w-full border border-gray-300 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
//                   value={selectedSession}
//                   onChange={(e) => setSelectedSession(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Session</option>
//                   <option value="2023_spring">Spring 2023</option>
//                   <option value="2023_fall">Fall 2023</option>
//                   <option value="2024_spring">Spring 2024</option>
//                   <option value="2024_fall">Fall 2024</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">Upload Date Sheet (Max 12 MB)</label>
//                 <div className="flex flex-col md:flex-row">
//                   <input
//                     type="file"
//                     className="flex-grow border border-black rounded-l-md px-3 py-2 focus:outline-none mb-2 md:mb-0" // Removed lg:mb-0
//                     accept=".pdf,image/*" // Restrict to PDF and common image types
//                     onChange={handleFileChange}
//                     required
//                   />
//                   {/* The browse button is typically handled by the input type="file" itself,
//                       but you can keep a styled label if you prefer.
//                       For simplicity, the input's default browse functionality is used.
//                       If you want a custom button, you'd hide the input and trigger its click.
//                   */}
//                   <button
//                     type="button"
//                     onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
//                     className="bg-[#004432] px-4 py-2 rounded-r-md border text-white cursor-pointer md:ml-2" // md:ml-2 for spacing
//                   >
//                     Browse
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             {/* Current Date Sheet Display */}
//             {currentDateSheetUrl && (
//               <div className="mt-6">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-2">Currently Uploaded Date Sheet:</h3>
//                 <a
//                   href={currentDateSheetUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-[#004432] hover:underline break-all"
//                 >
//                   {currentDateSheetUrl}
//                 </a>
//               </div>
//             )}

//             {/* Update Button */}
//             <div className="flex justify-start items-center mt-6">
//               <button
//                 type="submit"
//                 disabled={uploading}
//                 className={`flex cursor-pointer transition ${
//                   uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#004432] hover:bg-[#003522]'
//                 }`}
//               >
//                 <span className="bg-black text-white rounded-tl-lg py-3 px-3 flex items-center justify-center">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-5 h-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//                   </svg>
//                 </span>
//                 <span className="text-white rounded-br-lg flex justify-center items-center font-semibold px-4">
//                   {uploading ? "Uploading..." : "Upload Date Sheet"}
//                 </span>
//               </button>
//             </div>
//           </form>
//         </section>
//         {/* Admin Footer */}
//         <AdminFooter />
//       </div>
//     </div>
//   );
// }
