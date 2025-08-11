// app/api/auth/admin-login/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // For password hashing
import { findUserByEmail } from "@/lib/models/user"; // Your user model functions

// Define JWT payload type for admin user
interface JwtPayload {
  _id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Ensure this API route is dynamically rendered and runs in Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 1. Find the user by email
    // IMPORTANT: We need to explicitly select the password here because our schema has `select: false`
    const user = await findUserByEmail(email, true); // Pass true to select password

    if (!user) {
      console.error(`Login failed: User with email ${email} not found.`);
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // 2. Verify password
    // Ensure user.password exists, as it might be undefined if not explicitly selected
    if (!user.password) {
        console.error(`Login failed: Password not retrieved for user ${user.email}.`);
        return NextResponse.json({ message: "Authentication error. Please contact support." }, { status: 500 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.error(`Login failed: Invalid password for user ${user.email}.`);
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // 3. Check if the user has 'admin' role
    if (user.role !== 'admin') {
      console.error(`Login failed: User ${user.email} is not an administrator.`);
      return NextResponse.json({ message: "Access Denied: Only administrators can log in here." }, { status: 403 });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    console.log(`Admin user ${user.email} logged in successfully.`);
    return NextResponse.json({ success: true, message: "Login successful!", token });

  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Admin Login API Error:", error);
    return NextResponse.json({ message: "Internal server error.", details: errorMessage }, { status: 500 });
  }
}
