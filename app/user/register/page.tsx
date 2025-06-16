"use client";

import UserHeader from "@/app/components/UserHeader";
import UserFooter from "@/app/components/UserFooter";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cnic: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-8);
    setFormData((prev) => ({ ...prev, password }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Handle registration logic
  };

  return (
    <div className="overflow-x-hidden">
      {/* Header */}
      <UserHeader />

      {/* Registration Section */}
      <section className="my-10">
        <h2 className="text-center font-bold text-[#004432] lg:text-4xl md:text-2xl text-xl">
          REGISTER NOW
        </h2>

        <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                required
              />
            </div>

            {/* Generate Password */}
            <div>
              <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Generate Password</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="password"
                  placeholder="Generated Password"
                  value={formData.password}
                  readOnly
                  className="flex-1 px-4 py-2 border rounded-md focus:outline-none"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="bg-[#004432] text-white lg:px-3 lg:py-2 px-2 py-1 cursor-pointer rounded-md hover:bg-[#003522] transition"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* CNIC */}
            <div>
              <label htmlFor="cnic" className="block mb-1 font-semibold text-gray-700">CNIC / ID Card Number</label>
              <input
                type="text"
                name="cnic"
                placeholder="CNIC (e.g., 12345-6789012-3)"
                value={formData.cnic}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center gap-1">
              <span className="bg-black text-white rounded-l-md py-3 px-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <button
                type="submit"
                className="cursor-pointer bg-[#004432] text-white px-8 py-3 rounded-r-md font-semibold hover:bg-[#003522] transition"
              >
                REGISTER
              </button>
            </div>
          </form>
        </section>
      </section>

      {/* Footer */}
      <UserFooter />
    </div>
  );
}
