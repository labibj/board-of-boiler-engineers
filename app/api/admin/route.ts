import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { cookies } from "next/headers"; // Removed, as we're returning token in body

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    console.log("Received login request with:", email, password);

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const client = await clientPromise;
    // Ensure this matches the DB name in your MONGODB_URI or MONGODB_DB_NAME env var
    const db = client.db(process.env.MONGODB_DB_NAME || "boiler_board"); // Using MONGODB_DB_NAME from env
    const admin = await db.collection("admins").findOne({ email: normalizedEmail });

    console.log("Admin found in DB:", admin);

    if (!admin || !admin.password) {
      console.log("Invalid credentials: admin not found or no password.");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 🔍 DEBUG: Print stored hash and entered password
    console.log("🔐 Stored hash from DB:", admin.password);
    console.log("🔐 Entered plain password:", password);

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("✅ Password match:", isMatch);

    if (!isMatch) {
      console.log("Invalid credentials: password mismatch.");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // CHANGE 1: Include admin._id in the JWT payload
    // CHANGE 2: Ensure the payload matches the expected JwtPayload interface in other APIs
    const token = jwt.sign(
      {
        _id: admin._id.toString(), // Convert ObjectId to string for JWT consistency
        email: admin.email,
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // CHANGE 3: Return the token in the response body instead of setting a cookie
    console.log("🎉 Login successful, returning token in response.");
    return NextResponse.json({ message: "Login successful", token: token }, { status: 200 });

  } catch (error) {
    console.error("🔥 Login Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
