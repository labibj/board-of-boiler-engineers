import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Only protect /admin/* routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin-token")?.value;

    if (!token) {
      console.log("🔒 No token found, redirecting to /admin/login");
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("✅ Token verified:", decoded);
      return NextResponse.next();
    } catch (err) {
      console.log("❌ Invalid token:", err);
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next(); // Allow all other routes
}
