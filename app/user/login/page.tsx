"use client";

import UserHeader from "@/app/components/UserHeader";
import UserFooter from "@/app/components/UserFooter";

export default function LogIn() {
  return (
    <>
      {/* Header Section */}
      <UserHeader />

      {/* Login Form */}
      <section className="py-10 flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm bg-[#004432] p-6 rounded-lg shadow-md">

          {/* USER LOGIN Heading */}
          <h2 className="text-2xl font-bold text-center text-white mb-5 font-poppins">
            USER LOGIN
          </h2>

          {/* Email Field */}
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500"
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500"
            />
          </div>

          {/* Forgot Password */}
          <div className="mb-3 text-right">
            <a href="#" className="text-sm text-white hover:underline">
              Forgot your password?
            </a>
          </div>

          {/* LOGIN Button */}
          <div>
            <button
              className="w-full bg-white text-[#004432] font-semibold py-2 sm:py-2.5 md:py-3 text-sm sm:text-base rounded-md hover:bg-gray-100 transition cursor-pointer"
            >
              LOGIN
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <UserFooter />
    </>
  );
}
