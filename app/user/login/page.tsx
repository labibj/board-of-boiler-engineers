"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserHeader from "@/app/components/UserHeader";
import UserFooter from "@/app/components/UserFooter";

export default function LoginPage() {
  const [form, setForm] = useState({
    identifier: "", // CNIC or Email
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter(); // ✅ For redirect

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Login successful!");

        // ✅ Redirect to dashboard after short delay
        setTimeout(() => {
          router.push("/user/dashboard");
        }, 1000); 

      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Header Section */}
      <UserHeader />

      {/* Login Form */}
      <section className="py-10 flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm bg-[#004432] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-white mb-5 font-poppins">
            USER LOGIN
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              name="identifier"
              placeholder="CNIC or Email"
              onChange={handleChange}
              value={form.identifier}
              required
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              required
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500"
            />
            {/* LOGIN Button */}
          <div>
            <button
             type="submit"
              className="w-full bg-white text-[#004432] font-semibold py-2 sm:py-2.5 md:py-3 text-sm sm:text-base rounded-md hover:bg-gray-100 transition cursor-pointer"
            >
              LOGIN
            </button>
          </div>
          </form>
          {message && <p className="mt-2 text-center text-white">{message}</p>}
        </div>
      </section>

      {/* Footer Section */}
      <UserFooter />
    </>
  );
}
