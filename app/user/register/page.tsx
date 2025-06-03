"use client";

import UserHeader from "@/app/components/UserHeader";
import UserFooter from "@/app/components/UserFooter";


export default function Register() {
    return(
        <>
        {/* User Header */}
        <UserHeader />
        {/* Section Personal Data */}
       <section className="my-10">
        <h2 className="text-center font-bold text-[#004432] lg:text-4xl md:text-2xl text-xl">PERSONAL DATA</h2>
<div className="text-center mt-5 px-4">
  <p className="text-sm sm:text-base leading-relaxed mb-2">
    Note: BSc Engg Degree in Mechanical, Industries & Mechatronics holders are eligible to appear directly in the 2nd Class examination.
  </p>
  <p className="text-sm sm:text-base leading-relaxed mb-2">
    Note: Student must clear the exam within 5 years if they fail in any class. Just a validation message.
  </p>
  <p className="text-sm sm:text-base leading-relaxed">
    Note: Date format must be show in that format dd/mm/yyyy
  </p>
</div>

       </section>
       {/* /Section Personal Data */}
       {/* Section Personal Data Form */}
<section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <form className="space-y-6">

    {/* Row 1: Two selectors with labels */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="Certificate-now-required" className="block mb-1 font-semibold text-gray-700">Certificate Now Required</label>
        <select id="selector1" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]">
          <option value="">Select Option</option>
          <option value="option1">2nd class</option>
          <option value="option2">3rd class</option>
        </select>
      </div>

      <div>
        <label htmlFor="examination-type" className="block mb-1 font-semibold text-gray-700">Examination Type</label>
        <select id="selector2" className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]">
          <option value="">Select Option</option>
          <option value="optionA">New</option>
          <option value="optionB">Annual</option>
        </select>
      </div>
    </div>

    {/* Row 2: Name input fields with labels */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="fullName" className="block mb-1 font-semibold text-gray-700">Name in Full (Block Letters)</label>
        <input
          type="text"
          id="fullName"
          className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
        />
      </div>

      <div>
        <label htmlFor="fatherName" className="block mb-1 font-semibold text-gray-700">Father Name (Block Letters)</label>
        <input
          type="text"
          id="fatherName"
          className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
        />
      </div>
    </div>

    {/* Row 3: Email and Mobile Number */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
        />
      </div>

      <div>
        <label htmlFor="mobile" className="block mb-1 font-semibold text-gray-700">Mobile Number</label>
        <input
          type="tel"
          id="mobile"
          className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
        />
      </div>
    </div>

    {/* Row 4: Permanent Address */}
    <div>
      <label htmlFor="permanentAddress" className="block mb-1 font-semibold text-gray-700">Permanent Address</label>
      <input
        type="text"
        id="permanentAddress"
        className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
      />
    </div>

    {/* Row 5: Present Address and Date of Birth */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <div>
        <label htmlFor="presentAddress" className="block mb-1 font-semibold text-gray-700">Present Address</label>
        <input
          type="text"
          id="presentAddress"
          className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Date of Birth</label>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="number"
            placeholder="Day"
            min="1"
            max="31"
            className="w-full md:w-1/3 border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
          />
          <input
            type="number"
            placeholder="Month"
            min="1"
            max="12"
            className="w-full md:w-1/3 border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
          />
          <input
            type="number"
            placeholder="Year"
            min="1900"
            max="2099"
            className="w-full md:w-1/3 border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
          />
        </div>
      </div>
    </div>

    {/* Row 6: Identity Card Number */}
    <div>
      <label htmlFor="idCardNumber" className="block mb-1 font-semibold text-gray-700">Identity Card Number</label>
      <input
        type="text"
        id="idCardNumber"
        placeholder="35201-0000000-9"
        className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004432]"
      />
    </div>

    {/* Row 7: Upload Front Side and Back Side ID Card */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 font-semibold text-gray-700">Upload Front Side ID Card</label>
        {/* flex-col on mobile & tablet, flex-row on lg+ */}
        <div className="flex flex-col md:flex-col lg:flex-row">
          <input
            type="file"
            className="flex-grow border border-black rounded-l-md px-3 py-2 focus:outline-none mb-2 md:mb-2 lg:mb-0"
            accept="image/*,application/pdf"
          />
          <button
            type="button"
            className="bg-[#004432] px-4 py-2 rounded-r-md border text-white cursor-pointer lg:ml-2"
          >
            Browse
          </button>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Upload Back Side ID Card</label>
        {/* flex-col on mobile & tablet, flex-row on lg+ */}
        <div className="flex flex-col md:flex-col lg:flex-row">
          <input
            type="file"
            className="flex-grow border border-black rounded-l-md px-3 py-2 focus:outline-none mb-2 md:mb-2 lg:mb-0"
            accept="image/*,application/pdf"
          />
          <button
            type="button"
            className="bg-[#004432] px-4 py-2 rounded-r-md border text-white cursor-pointer lg:ml-2"
          >
            Browse
          </button>
        </div>
      </div>
    </div>

    {/* Row 8: Upload Profile Photo */}
    <div>
      <label className="block mb-1 font-semibold text-gray-700">Upload Profile Photo</label>
      <div className="flex flex-col md:flex-row">
        <input
          type="file"
          className="flex-grow border border-black rounded-l-md px-3 py-2 focus:outline-none mb-2 md:mb-0"
          accept="image/*"
        />
        <button
          type="button"
          className="bg-[#004432] px-4 py-2 rounded-r-md border text-white cursor-pointer md:ml-2"
        >
          Browse
        </button>
      </div>
    </div>

    {/* Row 9: Upload Fee Deposit / Money Order / Cash Slip */}
    <div>
      <label className="block mb-1 font-semibold text-gray-700">Fee Deposite / Money Order / Cash Slip (Enclose Original)</label>
      <div className="flex flex-col md:flex-row">
        <input
          type="file"
          className="flex-grow border border-black rounded-l-md px-3 py-2 focus:outline-none mb-2 md:mb-0"
          accept="image/*,application/pdf"
        />
        <button
          type="button"
          className="bg-[#004432] px-4 py-2 rounded-r-md border text-white cursor-pointer md:ml-2"
        >
          Browse
        </button>
      </div>
    </div>

    {/* Row 10: Next Button centered with plus icon on left */}
    <div className="flex justify-center items-center gap-1">
      <span className="bg-black text-white rounded-l-md py-3 px-4 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </span>
      <button
        type="submit"
        className="cursor-pointer bg-[#004432] text-white px-8 py-3 rounded-r-md font-semibold hover:bg-[#003522] transition"
      >
        NEXT
      </button>
    </div>
  </form>
</section>
        {/* User Footer */}
        <UserFooter />
        </>
    );
}