import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "CNIC or email and password are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("boiler_board");
    const usersCollection = db.collection("users");

    // Find by CNIC or email
    const user = await usersCollection.findOne({
      $or: [{ cnic: identifier }, { email: identifier }]
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid CNIC/email or password." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid CNIC/email or password." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, cnic: user.cnic, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { message: "Login successful.", token },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
