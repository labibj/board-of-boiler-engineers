// app/api/admin/create-sub-user/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // For password hashing
// Assuming you have these models/utilities for user operations
import { createUser, findUserByEmail } from "@/lib/models/user"; 

// Define JWT payload type for admin user (assuming admin tokens include role)
interface JwtPayload {
  _id: string;
  email: string;
  role: string; // Add role to the JWT payload
  iat?: number;
  exp?: number;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication: Get and verify the admin's JWT token
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

    // 2. Authorization: Check if the authenticated user has an 'admin' role
    if (decodedToken.role !== "admin") {
      console.error(`Authorization Error: User ${decodedToken.email} is not an admin.`);
      return NextResponse.json({ error: "Forbidden: Only administrators can create new users." }, { status: 403 });
    }

    // 3. Get user data from the request body
    const { name, email, password, role } = await request.json();

    // 4. Input Validation
    if (!name || !email || !password || !role) {
      console.error("Validation Error: Missing required fields.");
      return NextResponse.json({ error: "Name, email, password, and role are required." }, { status: 400 });
    }

    // Basic email format validation (more robust validation can be added)
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.error("Validation Error: Invalid email format.");
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Password strength validation
    if (password.length < 6) {
      console.error("Validation Error: Password too short.");
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // Validate role: ensure it's 'user' or 'admin'
    if (!['user', 'admin'].includes(role)) {
      console.error("Validation Error: Invalid role specified.");
      return NextResponse.json({ error: "Invalid role specified. Must be 'user' or 'admin'." }, { status: 400 });
    }

    // 5. Check if user with this email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.error(`Conflict Error: User with email ${email} already exists.`);
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
    }

    // 6. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // 7. Create the new user in the database
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      role,
    });

    // Ensure the password field is not returned in the response
    // Changed '_' to '_password' to satisfy the linter's unused variable rule
    const { password: _password, ...userWithoutPassword } = newUser;

    console.log(`User created successfully: ${userWithoutPassword.email}`);
    return NextResponse.json({ success: true, message: "Sub-user created successfully!", user: userWithoutPassword });

  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Form Submission Error:", error);
    return NextResponse.json({ error: "Failed to submit application", details: errorMessage }, { status: 500 });
  }
}
