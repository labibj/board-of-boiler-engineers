import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUserByEmail, updateUserProfile } from "@/lib/models/user";

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

    if (decodedToken.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Only administrators can access this resource." }, { status: 403 });
    }

    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json({ error: "User identifier is required." }, { status: 400 });
    }

    const user = await findUserByEmail(identifier);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Explicitly get userId after null check to satisfy TypeScript
    const userId = user._id.toString(); 

    // --- Roll Number Slip Generation Logic ---
    const simulatedRollNo = `RNS-${Math.floor(Math.random() * 100000)}`;

    // THESE LINES MUST BE UNCOMMENTED FOR updateUserProfile TO BE USED
    const updated = await updateUserProfile(userId, { rollNumber: simulatedRollNo });
    if (!updated) {
      console.error(`Failed to update user ${userId} with roll number.`);
      // You might want to return an error or handle this more gracefully
    }

    return NextResponse.json({
      success: true,
      message: "Roll number slip generated successfully (simulated)!",
      userId: userId, 
      userEmail: user.email,
      rollNumber: simulatedRollNo,
    });

  } catch (error) {
    console.error("Failed to generate roll number slip:", error);
    return NextResponse.json({ error: "Failed to generate roll number slip.", details: (error as Error).message }, { status: 500 });
  }
}
