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
  const [loading, setLoading] = useState(false); // Added loading state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on submission
    setError(''); // Clear previous errors

    try {
      // ⭐ CRUCIAL CHANGE: Point to the new admin login API route
      const res = await fetch('/api/auth/admin-login', { 
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok && data.success) { // Check for data.success as well
        // ✅ CRUCIAL CHANGE: Store the token from the response body in localStorage
        localStorage.setItem('admin_token', data.token); // Use 'admin_token' for clarity
        // alert('Login successful!'); // Using alert is discouraged in production. Consider a modal or toast.
        router.push('/admin/dashboard'); // Redirect to dashboard or relevant admin page
      } else {
        // Use data.message or data.error from the API response
        setError(data.message || data.error || 'Login failed'); 
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred during login. Please check network.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="admin-login-container min-h-screen flex flex-col">
      <AdminHeader />
      <section className="flex-grow flex items-center justify-center bg-white px-4 py-10">
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
              disabled={loading} // Disable button while loading
              className={`w-full bg-white text-[#004432] font-semibold py-2 sm:py-2.5 md:py-3 text-sm sm:text-base rounded-md hover:bg-gray-100 transition ${
                loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer' // Style for disabled state
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="error text-red-300 mt-2 text-sm text-center">{error}</p>}
          </form>
        </div>
      </section>
      <AdminFooter />
    </div>
  );
}
