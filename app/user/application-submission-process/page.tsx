"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { useRouter } from "next/navigation"; // Import useRouter
import UserHeader from "@/app/components/UserHeader";
import UserFooter from "@/app/components/UserFooter";

// Initial form structure
const initialFormData = {
  certificate: "",
  fullName: "",
  fatherName: "",
  email: "",
  mobile: "",
  permanentAddress: "",
  presentAddress: "",
  day: "",
  month: "",
  year: "",
  idCardNumber: "",
  departmentName: "",
  qualification: "",
  degreeDay: "",
  degreeMonth: "",
  degreeYear: "",
  frontIdCard: null,
  backIdCard: null,
  profilePhoto: null,
  feeSlip: null,
  certificateDiploma: "",
  certificateDiplomaFile: null, // For the actual file upload
  issueDay: "",
  issueMonth: "",
  issueYear: "",
  biolerRegistryNo: "",
  heatingSurface: "",
  workingPressure: "",
  factoryNameAddress: "",
  candidateDesignation: "",
  actualTime: "",
  dateStartService: "",
  serviceLetter: null, // For the service letter file upload
};

type FormDataType = typeof initialFormData;

export default function ApplicationSubmissionProcess() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); // New state for authentication check
  const router = useRouter(); // Initialize useRouter

  // Authentication check on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // No token found, redirect to login
        router.replace("/user/login");
        return;
      }

      try {
        // Verify token by calling a protected API
        const res = await fetch("/api/user/profile", { // Using profile API as a token validation endpoint
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Token invalid/expired, clear it and redirect
          localStorage.removeItem("token");
          router.replace("/user/login");
          return;
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("token"); // Clear token on network error too
        router.replace("/user/login");
        return;
      }
      setLoadingAuth(false); // Authentication check passed, show content
    };

    checkAuth();
  }, [router]); // Dependency array includes router

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
        day,
        month,
        year,
        idCardNumber,
        frontIdCard,
        backIdCard,
        profilePhoto,
        feeSlip,
      } = formData;

      if (
        !certificate || !fullName || !fatherName || !email || !mobile ||
        !permanentAddress || !presentAddress || !day || !month || !year ||
        !idCardNumber || !frontIdCard || !backIdCard || !profilePhoto || !feeSlip
      ) {
        alert("Please fill out all required fields and upload files in Step 1.");
        return;
      }
    } else if (step === 2) {
      const {
        departmentName,
        degreeDay,
        degreeMonth,
        degreeYear,
        certificateDiplomaFile,
      } = formData;

      if (
        !departmentName || !degreeDay || !degreeMonth || !degreeYear ||
        !certificateDiplomaFile
      ) {
        alert("Please fill out all required fields and upload the certificate/diploma file in Step 2.");
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
        setSubmitting(false); // Ensure submitting state is reset
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
      } else {
        console.error("Submission failed:", data);
        alert(`Failed to submit application: ${data.error || 'Unknown error'}`);
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

  return (
    <>
      <UserHeader />

      {step === 1 && (
        <section className="my-10">
          <h2 className="text-center font-bold text-[#004432] lg:text-4xl md:text-2xl text-xl">
            APPLICATION SUBMISSION
          </h2>

          <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <form className="space-y-6">

              {/* Certificate Selector */}
              <div>
                <label htmlFor="certificate" className="block mb-1 font-semibold text-gray-700">Certificate Now Required</label>
                <select value={formData.certificate} onChange={handleChange} id="certificate" className="w-full border border-black rounded-md px-3 py-2">
                  <option value="">Select Option</option>
                  <option value="option1">2nd class</option>
                  <option value="option2">3rd class</option>
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

              {/* Date of Birth */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Date of Birth</label>
                <div className="flex flex-col md:flex-row gap-2">
                  <input value={formData.day} onChange={handleChange} id="day" type="number" placeholder="Day" min="1" max="31" className="w-full md:w-1/3 border border-black rounded-md px-3 py-2" />
                  <input value={formData.month} onChange={handleChange} id="month" type="number" placeholder="Month" min="1" max="12" className="w-full md:w-1/3 border border-black rounded-md px-3 py-2" />
                  <input value={formData.year} onChange={handleChange} id="year" type="number" placeholder="Year" min="1900" max="2099" className="w-full md:w-1/3 border border-black rounded-md px-3 py-2" />
                </div>
              </div>

              {/* CNIC */}
              <div>
                <label htmlFor="idCardNumber" className="block mb-1 font-semibold text-gray-700">Identity Card Number</label>
                <input value={formData.idCardNumber} onChange={handleChange} id="idCardNumber" type="text" placeholder="35201-0000000-9" className="w-full border border-black rounded-md px-3 py-2" />
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
                <option value="option1">Matric</option>
                <option value="option2">FSc</option>
              </select>
            </div>
            <div>
              <label htmlFor="departmentName" className="block mb-1 font-semibold text-gray-700">Name of School. Institute. University</label>
              <input value={formData.departmentName} onChange={handleChange} type="text" id="departmentName" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Date of Obtaining the Certificate. Diploma / Degree</label>
              <div className="flex flex-col md:flex-row gap-2">
                <input value={formData.degreeDay} onChange={handleChange} id="degreeDay" type="number" placeholder="Day" min="1" max="31" className="w-full md:w-1/3 border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
                <input value={formData.degreeMonth} onChange={handleChange} id="degreeMonth" type="number" placeholder="Month" min="1" max="12" className="w-full md:w-1/3 border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
                <input value={formData.degreeYear} onChange={handleChange} id="degreeYear" type="number" placeholder="Year" min="1900" max="2099" className="w-full md:w-1/3 border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
              </div>
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
              <label className="block mb-1 font-semibold text-gray-700">Issue Date</label>
              <div className="flex flex-col md:flex-row gap-2">
                <input value={formData.issueDay} onChange={handleChange} id="issueDay" type="number" placeholder="Day" min="1" max="31" className="w-full md:w-1/3 border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
                <input value={formData.issueMonth} onChange={handleChange} id="issueMonth" type="number" placeholder="Month" min="1" max="12" className="w-full md:w-1/3 border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
                <input value={formData.issueYear} onChange={handleChange} id="issueYear" type="number" placeholder="Year" min="1900" max="2099" className="w-full md:w-1/3 border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
              </div>
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
                <label htmlFor="dateStartService" className="block mb-1 font-semibold text-gray-700">Date Start of Service</label>
                <input value={formData.dateStartService} onChange={handleChange} type="text" id="dateStartService" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]" />
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

      <UserFooter />
    </>
  );
}