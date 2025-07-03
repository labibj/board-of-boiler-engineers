import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // ✅ Use clientPromise directly
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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
    const db = client.db("boiler_board"); // ✅ Ensure this matches MongoDB database name
    const admin = await db.collection("admins").findOne({ email: normalizedEmail });

    console.log("Admin found in DB:", admin);

    if (!admin || !admin.password) {
      console.log("Invalid credentials: admin not found or no password.");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Invalid credentials: password mismatch.");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ email: admin.email, role: "admin" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Fix: await cookies
    const cookieStore = await cookies();
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    console.log("Login successful, token set in cookie.");

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
