import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const protectedPaths = ["/api/protected"];  // Add your protected API routes
  const { pathname } = req.nextUrl;

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}
