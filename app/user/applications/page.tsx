'use client';

import { useEffect, useState } from "react";

// ✅ Define the Application type
type Application = {
  fullName: string;
  certificate: string;
  email: string;
  submittedAt: string;
  frontIdCard: string;
  // You can add more fields here as needed
};

export default function UserApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") || "" : "";

  useEffect(() => {
    if (!email) return;

    fetch(`/api/applications/get?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setApplications(data.applications || []);
        setLoading(false);
      });
  }, [email]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#004432]">My Applications</h1>
      {applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <p><strong>Name:</strong> {app.fullName}</p>
              <p><strong>Certificate:</strong> {app.certificate}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Submitted On:</strong> {new Date(app.submittedAt).toLocaleString()}</p>
              {app.frontIdCard && (
                <a href={app.frontIdCard} className="text-blue-600 underline" target="_blank">Front ID</a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
