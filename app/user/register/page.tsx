"use client";

import UserHeader from "@/app/components/UserHeader";
import UserFooter from "@/app/components/UserFooter";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cnic: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`✅ ${data.message}`);
      // localStorage.setItem("token", data.token); // optional if you want immediate login
    } else {
      setMessage(`❌ ${data.message}`);
    }
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

        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold text-gray-700">Name</label>
            <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
            />
             </div>
             {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email</label>
            <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
             </div>
             {/* CNIC */}
            <div>
              <label htmlFor="cnic" className="block mb-1 font-semibold text-gray-700">CNIC / ID Card Number</label>
            <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              name="cnic"
              placeholder="CNIC"
              onChange={handleChange}
              required
            />
             </div>
            {/* Generate Password */}
            <div>
              <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Generate Password</label>
            <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
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
            {message && <p>{message}</p>}
          </form>
        </div>
      </section>

      {/* Footer */}
      <UserFooter />
    </div>
  );
}
