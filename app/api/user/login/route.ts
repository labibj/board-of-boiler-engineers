import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    const client = await clientPromise;
    const db = client.db(); // Default DB

    // Find user by CNIC or email
    const user = await db.collection("users").findOne({
      $or: [{ email: identifier }, { cnic: identifier }],
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // ✅ Make sure _id is included in the JWT
    const token = jwt.sign(
      {
        id: user._id.toString(), // ✅ include MongoDB user ID
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
