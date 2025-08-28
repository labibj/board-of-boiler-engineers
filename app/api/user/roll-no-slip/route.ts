import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
// ⭐ FIX: Import findRegularUserById
import { findRegularUserById } from "@/lib/models/user"; 
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
    console.log("User Roll No Slip API: Starting request.");
    await dbConnect();
    console.log("User Roll No Slip API: Database connection established or reused.");

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error("User Roll No Slip API: Authorization Error: No token provided.");
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (jwtError) {
      console.error("User Roll No Slip API: Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    const userId = decoded._id; // Extract user ID from the decoded token
    console.log(`User Roll No Slip API: Fetching roll no slip for userId: ${userId}`);

    // ⭐ FIX: Use findRegularUserById
    const user = await findRegularUserById(userId);
    console.log(`User Roll No Slip API: User found status: ${user ? 'Found' : 'Not Found'}.`);

    if (!user) {
      console.error(`User Roll No Slip API: User with ID ${userId} not found.`);
      return NextResponse.json({ success: false, message: "User profile not found." }, { status: 404 });
    }

    // 3. Return the rollNoSlipUrl if it exists
    if (user.rollNoSlipUrl) {
      console.log(`User Roll No Slip API: Found rollNoSlipUrl for user ${userId}.`);
      return NextResponse.json({ success: true, rollNoSlipUrl: user.rollNoSlipUrl });
    } else {
      console.log(`User Roll No Slip API: No rollNoSlipUrl found for user ${userId}.`);
      return NextResponse.json({ success: true, rollNoSlipUrl: null, message: "No roll number slip found for this user." });
    }

  } catch (err) {
    console.error("User Roll No Slip API: Failed to fetch roll number slip:", err);
    return NextResponse.json({ error: "Failed to fetch your roll number slip.", details: (err as Error).message }, { status: 500 });
  }
}
