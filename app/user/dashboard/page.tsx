"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ No token found. Please log in.");
      return;
    }

    fetch("/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setMessage("✅ Protected data fetched successfully.");
        }
      })
      .catch(() => {
        setMessage("❌ Error fetching protected data.");
      });
  }, []);

  return <div>{message}</div>;
  // return (
  //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  //     {[1, 2, 3, 4, 5, 6].map((n) => (
  //       <div
  //         key={n}
  //         className="bg-[#004432] text-white p-10 rounded-xl text-center text-xl"
  //       >
  //         Icon {n}
  //       </div>
  //     ))}
  //   </div>
  // );
}
