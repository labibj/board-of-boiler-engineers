"use client";

import { useState } from "react";
import UserHeader from "@/app/components/UserHeader";
import UserFooter from "@/app/components/UserFooter";

export default function LoginPage() {
  const [form, setForm] = useState({
    identifier: "", // CNIC or Email
    password: "",
  });
  const [message, setMessage] = useState("");

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
        // Optionally redirect:
        // router.push("/dashboard"); (if using Next.js router)
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

          {/* USER LOGIN Heading */}
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
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
      {message && <p className="mt-2 text-center">{message}</p>}
    </div>
    </section>

      {/* Footer Section */}
      <UserFooter />
    </>
  );
}
