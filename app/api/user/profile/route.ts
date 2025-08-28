import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUserById } from "@/lib/models/user"; // Import findUserById
import dbConnect from "@/lib/db"; // Import dbConnect

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
    // ⭐ FIX: Explicitly connect to the database at the very start of the handler
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

    // Use the findUserById function from your model
    const user = await findUserById(userId);
    console.log(`User Profile API: User found status: ${user ? 'Found' : 'Not Found'}.`);

    if (!user) {
      console.error(`User Profile API: User with ID ${userId} not found.`);
      return NextResponse.json({ success: false, message: "User profile not found." }, { status: 404 });
    }

    // Return the found user profile (ensure password is not included by toJSON)
    return NextResponse.json({ success: true, user: user });

  } catch (err) {
    console.error("User Profile API: Caught an error during request:", err);
    return NextResponse.json({ error: "Failed to fetch user profile.", details: (err as Error).message }, { status: 500 });
  }
}
