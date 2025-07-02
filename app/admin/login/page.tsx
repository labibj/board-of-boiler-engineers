'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from "@/app/components/AdminHeader";
import AdminFooter from "@/app/components/AdminFooter";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Token is stored in HTTP-only cookie (no need to use localStorage)
      router.push('/admin/dashboard');
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div className="admin-login-container">
      <AdminHeader />
      <section className="py-10 flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm bg-[#004432] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-white mb-5 font-poppins">
            Admin LOGIN
          </h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="w-full bg-white text-[#004432] font-semibold py-2 sm:py-2.5 md:py-3 text-sm sm:text-base rounded-md hover:bg-gray-100 transition cursor-pointer"
            >
              Login
            </button>
            {error && <p className="error text-red-500 mt-2 text-sm text-center">{error}</p>}
          </form>
        </div>
      </section>
      <AdminFooter />
    </div>
  );
}
