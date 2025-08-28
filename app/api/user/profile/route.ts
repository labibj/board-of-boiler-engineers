import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findRegularUserById } from "@/lib/models/user"; // ⭐ FIX: Import findRegularUserById
import dbConnect from "@/lib/db";

// Define JWT payload type for user
interface JwtPayload {
  _id: string; // This is the user ID
  email: string;
  iat?: number;
  exp?: number;
}

// Ensure this API route is dynamically rendered and runs in Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    console.log("User Profile API: Starting request.");
    await dbConnect();
    console.log("User Profile API: Database connection established or reused.");

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error("User Profile API: Authorization Error - No token provided.");
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (jwtError) {
      console.error("User Profile API: Authorization Error - Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    const userId = decoded._id; // Extract user ID from the decoded token
    console.log(`User Profile API: Fetching profile for userId: ${userId}`);

    // ⭐ FIX: Use findRegularUserById for regular users
    const user = await findRegularUserById(userId);
    console.log(`User Profile API: User found status: ${user ? 'Found' : 'Not Found'}.`);

    if (!user) {
      console.error(`User Profile API: User with ID ${userId} not found.`);
      return NextResponse.json({ success: false, message: "User profile not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: user });

  } catch (err) {
    console.error("User Profile API: Caught an error during request:", err);
    return NextResponse.json({ error: "Failed to fetch user profile.", details: (err as Error).message }, { status: 500 });
  }
}
