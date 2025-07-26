"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/app/utils/logout";
import UserHeader from "@/app/components/UserHeader";
import UserFooter from "@/app/components/UserFooter";
import { FaBell, FaSignOutAlt, FaEllipsisV, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// Flatpickr CSS and JS via CDN
const FlatpickrCSS = (
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"
  />
);
const FlatpickrJS = (
  <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
);

// Declare global Flatpickr for TypeScript
declare global {
  interface Window {
    flatpickr: any; // Using 'any' for simplicity, or you can import Flatpickr types if available
  }
}

// Initial form structure
const initialFormData = {
  certificate: "",
  fullName: "",
  fatherName: "",
  email: "",
  mobile: "",
  permanentAddress: "",
  presentAddress: "",
  dob: "", // Single field for Date of Birth (MM/DD/YYYY)
  idCardNumber: "",
  departmentName: "",
  qualification: "",
  degreeDate: "", // Combined field for Degree Date (MM/DD/YYYY)
  frontIdCard: null,
  backIdCard: null,
  profilePhoto: null,
  feeSlip: null,
  certificateDiploma: "",
  certificateDiplomaFile: null, // For the actual file upload
  issueDate: "", // Combined field for Issue Date (MM/DD/YYYY)
  biolerRegistryNo: "",
  heatingSurface: "",
  workingPressure: "",
  factoryNameAddress: "",
  candidateDesignation: "",
  actualTime: "",
  dateStartService: "", // Combined field for Date Start of Service (MM/DD/YYYY)
  serviceLetter: null, // For the service letter file upload
};

type FormDataType = typeof initialFormData;

export default function ApplicationSubmissionProcess() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [existingApplicationStatus, setExistingApplicationStatus] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // CNIC regex pattern: 5 digits - 7 digits - 1 digit
  const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
  // Date format regex for MM/DD/YYYY
  const dateFormatRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/;

  // Authentication check and existing application check on component mount
  useEffect(() => {
    const checkAuthAndApplication = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/user/login");
        return;
      }

      try {
        const authRes = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!authRes.ok) {
          localStorage.removeItem("token");
          router.replace("/user/login");
          return;
        }

        const appRes = await fetch("/api/user/applications", {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const appData = await appRes.json();

        if (appRes.ok && appData.application) {
          setHasExistingApplication(true);
          setExistingApplicationStatus(appData.application.status);
          setShowForm(false);
        } else {
          setHasExistingApplication(false);
          setExistingApplicationStatus(null);
          setShowForm(false);
        }

      } catch (error) {
        console.error("Authentication or application check failed:", error);
        localStorage.removeItem("token");
        router.replace("/user/login");
        return;
      }
      setLoadingAuth(false);
    };

    checkAuthAndApplication();
  }, [router]);

  // Initialize Flatpickr for date fields
  useEffect(() => {
    if (showForm) { // Only initialize if the form is visible
      // Function to initialize a single flatpickr instance
      const initFlatpickr = (id: string, initialValue: string) => {
        const element = document.getElementById(id) as HTMLInputElement;
        if (element && typeof window.flatpickr !== 'undefined') {
          // Destroy existing instance to prevent duplicates if component re-renders
          if ((element as any)._flatpickr) {
            (element as any)._flatpickr.destroy();
          }
          const fp = window.flatpickr(element, {
            dateFormat: "m/d/Y", // MM/DD/YYYY format
            defaultDate: initialValue,
            onChange: (selectedDates: Date[], dateStr: string) => { // Added types for onChange parameters
              setFormData((prev) => ({ ...prev, [id]: dateStr }));
            },
          });
          // Store the instance on the element for later destruction
          (element as any)._flatpickr = fp;
        }
      };

      // Initialize based on current step
      if (step === 1) {
        initFlatpickr("dob", formData.dob);
      } else if (step === 2) {
        initFlatpickr("degreeDate", formData.degreeDate);
      } else if (step === 3) {
        initFlatpickr("issueDate", formData.issueDate);
        initFlatpickr("dateStartService", formData.dateStartService);
      }
    }
  }, [step, showForm, formData.dob, formData.degreeDate, formData.issueDate, formData.dateStartService]); // Re-run when step or form visibility changes, or initial values change

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
    }
  };

  // Helper for MM/DD/YYYY date format validation
  const isValidDateFormat = (dateString: string) => {
    return dateFormatRegex.test(dateString);
  };

  const handleNextStep = () => {
    if (step === 1) {
      const {
        certificate,
        fullName,
        fatherName,
        email,
        mobile,
        permanentAddress,
        presentAddress,
        dob,
        idCardNumber,
        frontIdCard,
        backIdCard,
        profilePhoto,
        feeSlip,
      } = formData;

      if (
        !certificate || !fullName || !fatherName || !email || !mobile ||
        !permanentAddress || !presentAddress || !dob ||
        !idCardNumber || !frontIdCard || !backIdCard || !profilePhoto || !feeSlip
      ) {
        alert("Please fill out all required fields and upload files in Step 1.");
        return;
      }

      // CNIC validation
      if (!cnicPattern.test(idCardNumber)) {
        alert("Please enter a valid CNIC in 00000-0000000-0 format.");
        return;
      }

      // Date of Birth validation
      if (!isValidDateFormat(dob)) {
        alert("Please enter a valid Date of Birth in MM/DD/YYYY format.");
        return;
      }

    } else if (step === 2) {
      const {
        departmentName,
        degreeDate, // Use combined degreeDate
        certificateDiplomaFile,
      } = formData;

      if (
        !departmentName || !degreeDate || !certificateDiplomaFile
      ) {
        alert("Please fill out all required fields and upload the certificate/diploma file in Step 2.");
        return;
      }

      // Degree Date validation
      if (!isValidDateFormat(degreeDate)) {
        alert("Please enter a valid Date of Obtaining the Certificate/Diploma/Degree in MM/DD/YYYY format.");
        return;
      }

    } else if (step === 3) {
      const {
        issueDate, // Use combined issueDate
        dateStartService, // Use combined dateStartService
        biolerRegistryNo,
        heatingSurface,
        workingPressure,
        factoryNameAddress,
        candidateDesignation,
        actualTime,
        serviceLetter,
      } = formData;

      if (
        !issueDate || !biolerRegistryNo || !heatingSurface || !workingPressure ||
        !factoryNameAddress || !candidateDesignation || !actualTime || !dateStartService ||
        !serviceLetter
      ) {
        alert("Please fill out all required fields and upload the service letter in Step 3.");
        return;
      }

      // Issue Date validation
      if (!isValidDateFormat(issueDate)) {
        alert("Please enter a valid Issue Date in MM/DD/YYYY format.");
        return;
      }

      // Date Start of Service validation
      if (!isValidDateFormat(dateStartService)) {
        alert("Please enter a valid Date Start of Service in MM/DD/YYYY format.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to submit the form.");
        setSubmitting(false);
        return;
      }

      const submission = new FormData();

      for (const key in formData) {
        const value = formData[key as keyof FormDataType];

        if (value !== null && value !== undefined) {
          if (
            value &&
            typeof value === "object" &&
            "name" in value &&
            "size" in value &&
            "type" in value
          ) {
            submission.append(key, value as File);
          } else {
            submission.append(key, String(value));
          }
        }
      }

      const res = await fetch("/api/user/submit-application", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submission,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Application submitted successfully!");
        setFormData(initialFormData);
        setStep(1);
        router.push("/user/applications"); // Redirect to applications page
      } else {
        console.error("Submission failed:", data);
        alert(`Failed to submit application: ${data.error || 'Unknown error'}`);
        if (res.status === 409) {
          setHasExistingApplication(true);
          const appRes = await fetch("/api/user/applications", {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const appData = await appRes.json();
          if (appRes.ok && appData.application) {
            setExistingApplicationStatus(appData.application.status);
          } else {
            setExistingApplicationStatus("Unknown");
          }
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
      alert("An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading indicator while authentication check is in progress
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-[#004432]">Checking authentication...</p>
      </div>
    );
  }

  // Conditionally render message if application already exists
  if (hasExistingApplication) {
    let statusMessage = "";

    switch (existingApplicationStatus) {
      case "Pending":
        statusMessage = `Your application is currently <span class="font-semibold text-yellow-600">Pending</span> review by the admin. It will appear on your 'My Applications' page once accepted.`;
        break;
      case "Accepted":
        statusMessage = `Your application has been <span class="font-semibold text-green-600">Accepted</span> and is available on your 'My Applications' page.`;
        break;
      case "Cancelled":
        statusMessage = `Your application has been <span class="font-semibold text-red-600">Cancelled</span>. Please check your 'My Applications' page for details or contact support.`;
        break;
      case "Held":
        statusMessage = `Your application is currently <span class="font-semibold text-orange-600">Held</span>. Please check your 'My Applications' page for details or await further instructions.`;
        break;
      default:
        statusMessage = `You have already submitted an application. Its current status is <span class="font-semibold text-gray-600">unknown</span>. Please check your 'My Applications' page.`;
        break;
    }

    return (
      <>
        <UserHeader />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-[#004432] mb-4">Application Already Submitted</h2>
            <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: statusMessage }} />
            <button
              onClick={() => router.push("/user/applications")}
              className="bg-[#004432] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#003522] transition"
            >
              Go to My Applications
            </button>
          </div>
        </div>
        <UserFooter />
      </>
    );
  }

  // Render "Start New Application" button if no existing application and form is not yet shown
  if (!hasExistingApplication && !showForm) {
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
              {/* Assuming sidebarLinks is defined elsewhere and imported */}
              {/* Example of a sidebar link, replace with actual sidebarLinks mapping */}
              <Link href="/user/dashboard" className="flex items-center space-x-3 hover:text-gray-300">
                <Image src="/dashboard-icon.png" alt="Dashboard Icon" width={20} height={20} />
                <span className="font-semibold tracking-wide">Dashboard</span>
              </Link>
              <hr className="border-t border-white w-full" />
              <Link href="/user/profile" className="flex items-center space-x-3 hover:text-gray-300">
                <Image src="/profile-icon.png" alt="Profile Icon" width={20} height={20} />
                <span className="font-semibold tracking-wide">Profile</span>
              </Link>
              <hr className="border-t border-white w-full" />
              <Link href="/user/applications" className="flex items-center space-x-3 hover:text-gray-300">
                <Image src="/application-icon.png" alt="Applications Icon" width={20} height={20} />
                <span className="font-semibold tracking-wide">Applications</span>
              </Link>
              <hr className="border-t border-white w-full" />
              <Link href="/user/roll-no-slip" className="flex items-center space-x-3 hover:text-gray-300">
                <Image src="/logout-icon.png" alt="Roll No Slip Icon" width={20} height={20} />
                <span className="font-semibold tracking-wide">Roll No Slip</span>
              </Link>
              <hr className="border-t border-white w-full" />
              <Link href="/user/result" className="flex items-center space-x-3 hover:text-gray-300">
                <Image src="/result-icon.png" alt="Result Icon" width={20} height={20} />
                <span className="font-semibold tracking-wide">Result</span>
              </Link>
              <hr className="border-t border-white w-full" />
              <button onClick={() => handleLogout("/user/login")} className="flex items-center space-x-3 hover:text-gray-300 w-full text-left cursor-pointer">
                <FaSignOutAlt className="w-5 h-5" />
                <span className="font-semibold tracking-wide">Logout</span>
              </button>
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

        
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-[#004432] mb-4">Ready to Submit Your Application?</h2>
            <p className="text-gray-700 mb-6">
              You haven&#39;t submitted an application yet. Click the button below to start your application process.
            </p>
            <button
              onClick={() => setShowForm(true)} // Clicking this button will show the form
              className="bg-[#004432] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#003522] transition"
            >
              Start New Application
            </button>
          </div>
        </div>
            
        </div>
        <UserFooter />
        </div>
      </>
    );
  }

  // Render the form steps if no existing application and showForm is true
  return (
    <>
      {FlatpickrCSS} {/* Include Flatpickr CSS */}
      {FlatpickrJS}   {/* Include Flatpickr JS */}
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
            {/* Assuming sidebarLinks is defined elsewhere and imported */}
            {/* Example of a sidebar link, replace with actual sidebarLinks mapping */}
            <Link href="/user/dashboard" className="flex items-center space-x-3 hover:text-gray-300">
              <Image src="/dashboard-icon.png" alt="Dashboard Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Dashboard</span>
            </Link>
            <hr className="border-t border-white w-full" />
            <Link href="/user/profile" className="flex items-center space-x-3 hover:text-gray-300">
              <Image src="/profile-icon.png" alt="Profile Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Profile</span>
            </Link>
            <hr className="border-t border-white w-full" />
            <Link href="/user/applications" className="flex items-center space-x-3 hover:text-gray-300">
              <Image src="/application-icon.png" alt="Applications Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Applications</span>
            </Link>
            <hr className="border-t border-white w-full" />
            <Link href="/user/roll-no-slip" className="flex items-center space-x-3 hover:text-gray-300">
              <Image src="/logout-icon.png" alt="Roll No Slip Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Roll No Slip</span>
            </Link>
            <hr className="border-t border-white w-full" />
            <Link href="/user/result" className="flex items-center space-x-3 hover:text-gray-300">
              <Image src="/result-icon.png" alt="Result Icon" width={20} height={20} />
              <span className="font-semibold tracking-wide">Result</span>
            </Link>
            <hr className="border-t border-white w-full" />
            <button onClick={() => handleLogout("/user/login")} className="flex items-center space-x-3 hover:text-gray-300 w-full text-left cursor-pointer">
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-semibold tracking-wide">Logout</span>
            </button>
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

      {step === 1 && (
        <section className="my-10">
          <h2 className="text-center font-bold text-[#004432] lg:text-4xl md:text-2xl text-xl">
            APPLICATION SUBMISSION
          </h2>

          <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Notes at the beginning of the form */}
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p><strong>Note:</strong> BSc Engg Degree in Mechanical, Industries & Mechatronices holders are eligibile to appear directly in the 2nd Class examination.</p>
            </div>
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p><strong>Note:</strong> Date format must be shown in that format MM/DD/YYYY</p>
            </div>

            <form className="space-y-6">

              {/* Certificate Selector */}
              <div>
                <label htmlFor="certificate" className="block mb-1 font-semibold text-gray-700">Certificate Now Required</label>
                <select value={formData.certificate} onChange={handleChange} id="certificate" className="w-full border border-black rounded-md px-3 py-2">
                  <option value="">Select Option</option>
                  <option value="1st_class">1st class</option>
                  <option value="2nd_class">2nd class</option>
                  <option value="3rd_class">3rd class</option>
                </select>
              </div>

              {/* Full Name & Father's Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block mb-1 font-semibold text-gray-700">Name in Full (Block Letters)</label>
                  <input value={formData.fullName} onChange={handleChange} id="fullName" type="text" className="w-full border border-black rounded-md px-3 py-2" />
                </div>
                <div>
                  <label htmlFor="fatherName" className="block mb-1 font-semibold text-gray-700">Father Name (Block Letters)</label>
                  <input value={formData.fatherName} onChange={handleChange} id="fatherName" type="text" className="w-full border border-black rounded-md px-3 py-2" />
                </div>
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email</label>
                  <input value={formData.email} onChange={handleChange} id="email" type="email" className="w-full border border-black rounded-md px-3 py-2" />
                </div>
                <div>
                  <label htmlFor="mobile" className="block mb-1 font-semibold text-gray-700">Mobile</label>
                  <input value={formData.mobile} onChange={handleChange} id="mobile" type="tel" className="w-full border border-black rounded-md px-3 py-2" />
                </div>
              </div>

              {/* Addresses */}
              <div>
                <label htmlFor="permanentAddress" className="block mb-1 font-semibold text-gray-700">Permanent Address</label>
                <input value={formData.permanentAddress} onChange={handleChange} id="permanentAddress" type="text" className="w-full border border-black rounded-md px-3 py-2" />
              </div>

              <div>
                <label htmlFor="presentAddress" className="block mb-1 font-semibold text-gray-700">Present Address</label>
                <input value={formData.presentAddress} onChange={handleChange} id="presentAddress" type="text" className="w-full border border-black rounded-md px-3 py-2" />
              </div>

              {/* Date of Birth (with Flatpickr) */}
              <div>
                <label htmlFor="dob" className="block mb-1 font-semibold text-gray-700">Date of Birth (MM/DD/YYYY)</label>
                <input
                  value={formData.dob}
                  onChange={handleChange}
                  id="dob"
                  type="text" // Type text for Flatpickr
                  placeholder="MM/DD/YYYY"
                  className="w-full border border-black rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* CNIC */}
              <div>
                <label htmlFor="idCardNumber" className="block mb-1 font-semibold text-gray-700">Identity Card Number</label>
                <input
                  value={formData.idCardNumber}
                  onChange={handleChange}
                  id="idCardNumber"
                  type="text"
                  placeholder="35201-0000000-9"
                  className="w-full border border-black rounded-md px-3 py-2"
                  pattern="^\d{5}-\d{7}-\d{1}$"
                  title="CNIC must be in 00000-0000000-0 format"
                  required
                />
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Upload Front Side ID Card</label>
                  <input id="frontIdCard" onChange={handleFileChange} type="file" accept="image/*,application/pdf" className="w-full border border-black rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Upload Back Side ID Card</label>
                  <input id="backIdCard" onChange={handleFileChange} type="file" accept="image/*,application/pdf" className="w-full border border-black rounded-md px-3 py-2" />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Upload Profile Photo</label>
                <input id="profilePhoto" onChange={handleFileChange} type="file" accept="image/*" className="w-full border border-black rounded-md px-3 py-2" />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Fee Deposite / Money Order / Cash Slip (Enclose Original)</label>
                <input id="feeSlip" onChange={handleFileChange} type="file" accept="image/*,application/pdf" className="w-full border border-black rounded-md px-3 py-2" />
              </div>

              {/* NEXT Button */}
              <div className="flex justify-center items-center gap-1">
                <span className="bg-black text-white rounded-l-md py-3 px-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <button type="button" onClick={handleNextStep} className="cursor-pointer bg-[#004432] text-white px-8 py-3 rounded-r-md font-semibold hover:bg-[#003522] transition">
                  NEXT
                </button>
              </div>
            </form>
          </section>
        </section>
      )}

      {step === 2 && (
        <section className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-center font-bold text-[#004432] lg:text-4xl md:text-2xl text-xl mb-5">
            APPLICATION SUBMISSION
          </h2>
          <h3 className="text-xl font-bold mb-4 text-center font-open-sans">ACADEMIC / TECHNICAL QUALIFICATION</h3>
          <h6 className="text-[#258c71] font-poppins text-base text-center font-semibold">
            (Attached Attested Copies of Certificates)
          </h6>
            <div className="space-y-4">
                        <div>
              <label htmlFor="certificateDiploma" className="block mb-1 font-semibold text-gray-700">Certificate. Diploma or Degree</label>
              <select value={formData.certificateDiploma} onChange={handleChange} id="certificateDiploma" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]">
                <option value="">Select Option</option>
                <option value="1st_class">1st class</option>
                <option value="2nd_class">2nd class</option>
                <option value="3rd_class">3rd class</option>
              </select>
            </div>
            <div>
              <label htmlFor="departmentName" className="block mb-1 font-semibold text-gray-700">Name of School. Institute. University</label>
              <input value={formData.departmentName} onChange={handleChange} type="text" id="departmentName" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Date of Obtaining the Certificate. Diploma / Degree (MM/DD/YYYY)</label>
              <input
                  value={formData.degreeDate}
                  onChange={handleChange}
                  id="degreeDate"
                  type="text" // Type text for Flatpickr
                  placeholder="MM/DD/YYYY"
                  className="w-full border border-black rounded-md px-3 py-2"
                  required
                />
            </div>
                        <div>
            <label className="block mb-1 font-semibold text-gray-700">Upload Certificate. Diploma / Degree</label>
                        <div className="flex flex-col md:flex-row">
                          <input id="certificateDiplomaFile" onChange={handleFileChange} type="file" className="flex-grow border border-black rounded-l-md px-3 py-2 focus:outline-none mb-2 md:mb-0" accept="image/*,application/pdf" />
                          <button type="button" className="bg-[#004432] px-4 py-2 rounded-r-md border text-white cursor-pointer md:ml-2">Browse</button>
                        </div>
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} type="button" className="bg-gray-600 text-white px-6 py-2 rounded cursor-pointer">Back</button>
              <div className="flex justify-center items-center gap-1">
                <span className="bg-black text-white rounded-l-md py-3 px-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <button type="button" onClick={handleNextStep} className="cursor-pointer bg-[#004432] text-white px-8 py-3 rounded-r-md font-semibold hover:bg-[#003522] transition">
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-center font-bold text-[#004432] lg:text-4xl md:text-2xl text-xl mb-5">
            FINAL SUBMISSION
          </h2>
                        <h3 className="text-xl font-bold mb-4 text-center font-open-sans">SERVICE LETTER</h3>
          <h6 className="text-[#258c71] font-poppins text-base text-center font-semibold">
            Name and desigination who signed the Service Letter (Manager/Owner)
          </h6>
          <div className="space-y-4">
                        <div>
              <label className="block mb-1 font-semibold text-gray-700">Issue Date (MM/DD/YYYY)</label>
              <input
                  value={formData.issueDate}
                  onChange={handleChange}
                  id="issueDate"
                  type="text" // Type text for Flatpickr
                  placeholder="MM/DD/YYYY"
                  className="w-full border border-black rounded-md px-3 py-2"
                  required
                />
            </div>
            <div>
              <label htmlFor="biolerRegistryNo" className="block mb-1 font-semibold text-gray-700">Boiler Registry/Maker No.</label>
              <input value={formData.biolerRegistryNo} onChange={handleChange} type="text" id="biolerRegistryNo" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="heatingSurface" className="block mb-1 font-semibold text-gray-700">Heating Surface or Capacity</label>
                <input value={formData.heatingSurface} onChange={handleChange} type="text" id="heatingSurface" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
              </div>
              <div>
                <label htmlFor="workingPressure" className="block mb-1 font-semibold text-gray-700">Working Pressure</label>
                <input value={formData.workingPressure} onChange={handleChange} type="text" id="workingPressure" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
              </div>
            </div>
                        <div>
              <label htmlFor="biolerRegistryNo" className="block mb-1 font-semibold text-gray-700">Boiler Registry/Maker No.</label>
              <input value={formData.biolerRegistryNo} onChange={handleChange} type="text" id="biolerRegistryNo" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
            </div>
                            <div>
              <label htmlFor="factoryNameAddress" className="block mb-1 font-semibold text-gray-700">Name and Address of Factory</label>
              <input value={formData.factoryNameAddress} onChange={handleChange} type="text" id="factoryNameAddress" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
            </div>
              <div>
              <label htmlFor="candidateDesignation" className="block mb-1 font-semibold text-gray-700">Designation of the Candidate</label>
              <input value={formData.candidateDesignation} onChange={handleChange} type="text" id="candidateDesignation" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="actualTime" className="block mb-1 font-semibold text-gray-700">Actual Time Served on Bioler</label>
                <input value={formData.actualTime} onChange={handleChange} type="text" id="actualTime" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
              </div>
              <div>
                <label htmlFor="dateStartService" className="block mb-1 font-semibold text-gray-700">Date Start of Service (MM/DD/YYYY)</label>
                <input
                  value={formData.dateStartService}
                  onChange={handleChange}
                  id="dateStartService"
                  type="text" // Type text for Flatpickr
                  placeholder="MM/DD/YYYY"
                  className="w-full border border-black rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>
                            <div>
              <label className="block mb-1 font-semibold text-gray-700">Upload Service Letter</label>
              <div className="flex flex-col md:flex-row">
                <input id="serviceLetter" onChange={handleFileChange} type="file" className="flex-grow border border-black rounded-l-md px-3 py-2 focus:outline-none mb-2 md:mb-0" accept="image/*,application/pdf" />
                <button type="button" className="bg-[#004432] px-4 py-2 rounded-r-md border text-white cursor-pointer md:ml-2">Browse</button>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} type="button" className="bg-gray-600 text-white px-6 py-2 rounded cursor-pointer">Back</button>
                            <div className="flex justify-center items-center gap-1">
                <span className="bg-black text-white rounded-l-md py-3 px-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`cursor-pointer px-8 py-3 rounded-r-md font-semibold transition ${
                    submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#004432] text-white hover:bg-[#003522]'
                  }`}
                >
                  {submitting ? "Submitting..." : "SUBMIT"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

            </div>
            
        </div>


      </div>


      <UserFooter />
    </>
  );
}
