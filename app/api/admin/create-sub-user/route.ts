// app/api/admin/create-sub-user/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // For password hashing
// ⭐ FIX: Import createRegularUser and findRegularUserByEmail
import { createRegularUser, findRegularUserByEmail } from "@/lib/models/user"; 
import dbConnect from "@/lib/db"; // Import dbConnect

// Define JWT payload type for admin user (assuming admin tokens include role)
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
    // Connect to DB before any operations
    console.log("Admin Create Sub-User API: Starting request.");
    await dbConnect();
    console.log("Admin Create Sub-User API: Database connection established or reused.");

    // 1. Authentication: Get and verify the admin's JWT token
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      console.error("Admin Create Sub-User API: Authorization Error: No token provided.");
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (jwtError) {
      console.error("Admin Create Sub-User API: Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    // 2. Authorization: Check if the authenticated user has an 'admin' role
    if (decodedToken.role !== "admin") {
      console.error(`Admin Create Sub-User API: Authorization Error: User ${decodedToken.email} is not an admin.`);
      return NextResponse.json({ error: "Forbidden: Only administrators can create new users." }, { status: 403 });
    }

    // 3. Get user data from the request body
    const { name, email, password, role } = await request.json();
    console.log(`Admin Create Sub-User API: Received request to create user: ${email} with role: ${role}`);

    // 4. Input Validation
    if (!name || !email || !password || !role) {
      console.error("Admin Create Sub-User API: Validation Error: Missing required fields.");
      return NextResponse.json({ error: "Name, email, password, and role are required." }, { status: 400 });
    }

    // Basic email format validation (more robust validation can be added)
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.error("Admin Create Sub-User API: Validation Error: Invalid email format.");
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Password strength validation
    if (password.length < 6) {
      console.error("Admin Create Sub-User API: Validation Error: Password too short.");
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // Validate role: ensure it's 'user' or 'admin' (can only create regular users here)
    if (role !== 'user') { // Admins can only create regular users via this route
      console.error("Admin Create Sub-User API: Validation Error: Invalid role specified. Can only create 'user' roles here.");
      return NextResponse.json({ error: "Invalid role specified. This route can only create 'user' roles." }, { status: 400 });
    }

    // 5. Check if user with this email already exists
    console.log(`Admin Create Sub-User API: Checking for existing user with email: ${email}...`);
    // ⭐ FIX: Use findRegularUserByEmail
    const existingUser = await findRegularUserByEmail(email);
    if (existingUser) {
      console.error(`Admin Create Sub-User API: Conflict Error: User with email ${email} already exists.`);
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
    }

    // 6. Hash the password
    console.log("Admin Create Sub-User API: Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // 7. Create the new user in the database
    console.log("Admin Create Sub-User API: Creating new regular user...");
    // ⭐ FIX: Use createRegularUser
    const newUser = await createRegularUser({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      role, // This should be 'user' as per validation above
    });

    console.log(`Admin Create Sub-User API: User created successfully: ${newUser.email}`);
    return NextResponse.json({ success: true, message: "Sub-user created successfully!", user: newUser });

  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Admin Create Sub-User API: Failed to create sub-user:", error);
    return NextResponse.json({ error: "Failed to create sub-user.", details: errorMessage }, { status: 500 });
  }
}
