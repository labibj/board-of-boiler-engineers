"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { useRouter } from "next/navigation";
import UserHeader from "@/app/components/UserHeader";
import UserFooter from "@/app/components/UserFooter";

export default function LoginPage() {
  const [form, setForm] = useState({
    identifier: "", // CNIC or Email
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // New loading state for initial check
  const router = useRouter();

  // Effect to check authentication status on component mount
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Attempt to verify the token by calling a protected API route
          // Using /api/user/profile as a lightweight check for token validity
          const res = await fetch("/api/user/profile", {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (res.ok) {
            // Token is valid, redirect to dashboard
            router.replace("/user/dashboard"); // Use replace to prevent going back to login page
          } else {
            // Token is invalid or expired, clear it and stay on login page
            localStorage.removeItem("token");
            setLoading(false); // Authentication check complete, show login form
          }
        } catch (error) {
          console.error("Authentication check failed:", error);
          localStorage.removeItem("token"); // Clear token on network error too
          setLoading(false); // Authentication check complete, show login form
        }
      } else {
        setLoading(false); // No token, show login form
      }
    };

    checkAuthAndRedirect();
  }, [router]); // Dependency array includes router

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

        // Redirect to dashboard immediately after successful login
        router.replace("/user/dashboard"); // Use replace here as well
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  // Show a loading indicator while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-[#004432]">Checking authentication...</p>
      </div>
    );
  }

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
