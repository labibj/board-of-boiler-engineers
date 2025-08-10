// app/api/admin/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findAllUsers, UserData } from "@/lib/models/user"; // Import findAllUsers and UserData

// Define JWT payload type for admin (assuming admin tokens include role)
interface JwtPayload {
  _id: string;
  email: string;
  role: string; // Add role to the JWT payload
  iat?: number;
  exp?: number;
}

// Ensure this API route is dynamically rendered and runs in Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication: Get and verify the admin's JWT token
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      console.error("Authorization Error: No token provided.");
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    // 2. Authorization: Check if the authenticated user has an 'admin' role
    if (decodedToken.role !== "admin") {
      console.error(`Authorization Error: User ${decodedToken.email} is not an admin.`);
      return NextResponse.json({ error: "Forbidden: Only administrators can view users." }, { status: 403 });
    }

    // 3. Fetch all users from the database
    const users: UserData[] = await findAllUsers();

    // 4. Return the list of users
    // Ensure passwords are not sent back (should be handled by toJSON in user model)
    return NextResponse.json({ success: true, users: users });

  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users.", details: errorMessage }, { status: 500 });
  }
}
