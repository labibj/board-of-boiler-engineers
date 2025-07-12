import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    const client = await clientPromise;
    // Ensure this matches the DB name in your MONGODB_URI or MONGODB_DB_NAME env var
    const db = client.db(process.env.MONGODB_DB_NAME || "boiler_board");
    const users = db.collection("users");

    // Find user by email or CNIC
    const user = await users.findOne({
      $or: [{ email: identifier }, { cnic: identifier }],
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Ensure user.password exists before comparing
    if (!user.password) {
      console.error("User found but no password field:", user);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // CHANGE HERE: Use '_id' as the key and convert ObjectId to string
    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email }, // Changed 'id' to '_id' and converted to string
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
