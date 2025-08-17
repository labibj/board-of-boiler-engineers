// app/api/auth/admin-login/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // For password hashing
import { findUserByEmail } from "@/lib/models/user"; // Your user model functions
import dbConnect from "@/lib/db"; // Assuming your dbConnect is in lib/db.ts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // ⭐ Explicitly connect to the database at the very start of the handler
    console.log("Admin Login API: Starting request.");
    console.log("Admin Login API: Attempting to connect to database...");
    await dbConnect();
    console.log("Admin Login API: Database connection established or reused.");

    const { email, password } = await request.json();
    // Trim email to handle any whitespace
    const trimmedEmail = email.trim();
    console.log(`Admin Login API: Received login attempt for email: ${trimmedEmail}, password: ${password}`); // Added password log

    // 1. Find the user by email
    console.log(`Admin Login API: Calling findUserByEmail for ${trimmedEmail}...`);
    const user = await findUserByEmail(trimmedEmail, true); // Pass true to select password
    console.log(`Admin Login API: User found status: ${user ? 'Found' : 'Not Found'}.`);

    if (!user) {
      console.error(`Admin Login API: Login failed - User with email ${trimmedEmail} not found.`);
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // 2. Verify password
    if (!user.password) {
      console.error(`Admin Login API: Login failed - Password not retrieved for user ${user.email}. This indicates an issue with findUserByEmail(..., true).`);
      return NextResponse.json({ message: "Authentication error. Please contact support." }, { status: 500 });
    }
    console.log("Admin Login API: Comparing passwords...");
    console.log(`Admin Login API: Stored password hash: ${user.password}`); // Added debug log for stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Admin Login API: Password comparison result: ${isPasswordValid}`); // Added debug log
    if (!isPasswordValid) {
      console.error(`Admin Login API: Login failed - Invalid password for user ${user.email}.`);
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // 3. Check if the user has 'admin' role
    if (user.role !== 'admin') {
      console.error(`Admin Login API: Login failed - User ${user.email} is not an administrator.`);
      return NextResponse.json({ message: "Access Denied: Only administrators can log in here." }, { status: 403 });
    }

    // 4. Generate JWT
    console.log("Admin Login API: Generating JWT...");
    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    console.log("Admin Login API: JWT generated.");

    console.log(`Admin Login API: Admin user ${user.email} logged in successfully. Sending response.`);
    return NextResponse.json({ success: true, message: "Login successful!", token });

  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Admin Login API: Caught an error during request:", error);
    return NextResponse.json({ message: "Internal server error.", details: errorMessage }, { status: 500 });
  }
}