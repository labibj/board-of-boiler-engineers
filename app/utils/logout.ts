// /app/utils/logout.ts

export const handleLogout = (redirectTo: string = "/user/login") => {
  localStorage.removeItem("token");
  window.location.href = redirectTo;
};
