import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
// ⭐ FIX: Import findRegularUserByEmail and updateRegularUserProfile
import { findRegularUserByEmail, updateRegularUserProfile } from "@/lib/models/user";
import dbConnect from "@/lib/db"; // Import dbConnect

// Define JWT payload type for admin (assuming role: 'admin')
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

export async function POST(request: NextRequest) {
  try {
    console.log("Admin Roll No Slip API: Starting request.");
    await dbConnect();
    console.log("Admin Roll No Slip API: Database connection established or reused.");

    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      console.error("Admin Roll No Slip API: Authorization Error: No token provided.");
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (jwtError) {
      console.error("Admin Roll No Slip API: Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    if (decodedToken.role !== "admin") {
      console.error(`Admin Roll No Slip API: Authorization Error: User ${decodedToken.email} is not an admin.`);
      return NextResponse.json({ error: "Forbidden: Only administrators can access this resource." }, { status: 403 });
    }

    // Assuming the request body contains an email or ID to find the user
    const { identifier } = await request.json(); // 'identifier' could be email or user ID
    console.log(`Admin Roll No Slip API: Received request for identifier: ${identifier}`);

    if (!identifier) {
      console.error("Admin Roll No Slip API: Validation Error: User identifier is required.");
      return NextResponse.json({ error: "User identifier is required." }, { status: 400 });
    }

    // ⭐ FIX: Use findRegularUserByEmail to locate the regular user
    const user = await findRegularUserByEmail(identifier);
    console.log(`Admin Roll No Slip API: User found status: ${user ? 'Found' : 'Not Found'}.`);

    if (!user) {
      console.error(`Admin Roll No Slip API: User with identifier ${identifier} not found.`);
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Explicitly get userId after null check to satisfy TypeScript
    const userId = user._id.toString(); 

    // --- Roll Number Slip Generation Logic ---
    const simulatedRollNo = `RNS-${Math.floor(Math.random() * 100000)}`;
    console.log(`Admin Roll No Slip API: Generated simulated Roll No: ${simulatedRollNo} for userId: ${userId}`);

    // ⭐ FIX: Use updateRegularUserProfile
    const updated = await updateRegularUserProfile(userId, { rollNumber: simulatedRollNo });
    if (!updated) {
      console.error(`Admin Roll No Slip API: Failed to update user ${userId} with roll number.`);
      return NextResponse.json({ error: "Failed to update user profile with roll number." }, { status: 500 });
    }
    console.log(`Admin Roll No Slip API: User ${userId} updated with roll number.`);

    return NextResponse.json({
      success: true,
      message: "Roll number slip generated successfully (simulated)!",
      userId: userId, 
      userEmail: user.email,
      rollNumber: simulatedRollNo,
    });

  } catch (error) {
    console.error("Admin Roll No Slip API: Failed to generate roll number slip:", error);
    return NextResponse.json({ error: "Failed to generate roll number slip.", details: (error as Error).message }, { status: 500 });
  }
}
