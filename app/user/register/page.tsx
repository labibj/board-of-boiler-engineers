"use client";

import UserHeader from "@/app/components/UserHeader";
import UserFooter from "@/app/components/UserFooter";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for potential redirect

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cnic: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter(); // Initialize useRouter

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true); // Set loading to true

    // Client-side password confirmation validation
    if (form.password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // Only send 'form' which contains 'password', not 'confirmPassword'
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        // Optional: Automatically log in and redirect after successful registration
        if (data.token) {
          localStorage.setItem("token", data.token);
          setTimeout(() => { // Small delay for message to be seen
            router.replace("/user/dashboard"); // Redirect to dashboard
          }, 1000);
        } else {
          // If no token returned, just show success message and suggest login
          setTimeout(() => {
            router.push("/user/login"); // Redirect to login page
          }, 2000);
        }
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
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
                value={form.name}
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
                value={form.email}
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
                value={form.cnic}
                required
              />
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Password</label>
              <input
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
                required
              />
            </div>
            {/* Confirm Password (NEW FIELD) */}
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 font-semibold text-gray-700">Confirm Password</label>
              <input
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                type="password"
                name="confirmPassword" // Use a distinct name for this input
                placeholder="Confirm Password"
                onChange={handleConfirmPasswordChange} // Use new handler
                value={confirmPassword}
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
                disabled={loading} // Disable button when loading
                className={`cursor-pointer bg-[#004432] text-white px-8 py-3 rounded-r-md font-semibold transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#003522]'
                }`}
              >
                {loading ? "REGISTERING..." : "REGISTER"}
              </button>
            </div>
            {message && <p className="mt-4 text-center text-red-500">{message}</p>} {/* Added styling for message */}
          </form>
        </div>
      </section>

      {/* Footer */}
      <UserFooter />
    </div>
  );
}
