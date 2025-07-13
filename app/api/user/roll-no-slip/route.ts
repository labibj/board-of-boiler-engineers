import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUserById } from "@/lib/models/user"; // Import user model functions

// Define JWT payload type for user
interface JwtPayload {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate User
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

    const userId = decoded._id;

    // 2. Fetch user data from MongoDB to get rollNoSlipUrl
    const user = await findUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 3. Return the rollNoSlipUrl
    if (user.rollNoSlipUrl) {
      return NextResponse.json({ success: true, rollNoSlipUrl: user.rollNoSlipUrl });
    } else {
      return NextResponse.json({ success: true, rollNoSlipUrl: null, message: "No roll number slip found for this user." });
    }

  } catch (err) {
    console.error("Fetch User Roll No Slip Error:", err);
    return NextResponse.json({ error: "Failed to fetch roll number slip.", details: (err as Error).message }, { status: 500 });
  }
}
