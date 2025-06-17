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

        <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="cnic"
        placeholder="CNIC"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
    </section>
      </section>

      {/* Footer */}
      <UserFooter />
    </div>
  );
}
