import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db"; // Corrected import: using default import
import jwt from "jsonwebtoken";
import { findApplicationByUserId } from "@/lib/models/application";

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
    // Connect to DB before any operations
    await dbConnect();

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    const userId = decoded._id; // Extract user ID from the decoded token

    // Use the findApplicationByUserId function from your model
    const application = await findApplicationByUserId(userId);

    if (!application) {
      // If no application is found for this user ID, return null application
      return NextResponse.json({ success: true, application: null, message: "You have not submitted an application yet." });
    }

    // Return the found application.
    return NextResponse.json({ success: true, application: application });

  } catch (err) {
    console.error("User Get Application Error:", err);
    return NextResponse.json({ error: "Failed to fetch your application.", details: (err as Error).message }, { status: 500 });
  }
}
