// /app/data/sidebarLinks.ts
export const sidebarLinks = [
  {
    label: "Dashboard",
    icon: "/dashboard-icon.png",
    href: "/user/dashboard",
  },
  {
    label: "Profile",
    icon: "/profile-icon.png",
    href: "/user/profile",
  },
  {
    label: "Applications",
    icon: "/application-icon.png",
    href: "/user/applications",
  },
  {
    label: "Roll No Slip",
    icon: "/datesheet-icon.png",
    href: "/user/roll-no-slip",
  },
  {
    label: "Result",
    icon: "/result-icon.png",
    href: "/user/results",
  },
  {
    label: "Logout",
    icon: "/logout-icon.png",
    href: "/logout",
    isLogout: true, // ← 🧠 This is key
  },
];
