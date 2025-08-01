import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { name, email, cnic, password } = await req.json();

    // CNIC regex pattern: 5 digits - 7 digits - 1 digit
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;

    if (!name || !email || !cnic || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Backend CNIC format validation
    if (!cnicPattern.test(cnic)) {
      return NextResponse.json(
        { message: "CNIC must be in 00000-0000000-0 format." },
        { status: 400 } // Bad Request
      );
    }

    const client = await clientPromise;
    const db = client.db("boiler_board");
    const usersCollection = db.collection("users");

    // Check for existing CNIC or email
    const existingUser = await usersCollection.findOne({
      $or: [{ cnic }, { email }]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this CNIC or email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      cnic,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Ensure _id is converted to string for JWT payload if it's an ObjectId
    const userIdString = result.insertedId.toHexString();

    const token = jwt.sign(
      { _id: userIdString, cnic, email }, // Use _id from MongoDB as userId
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { message: "User registered successfully.", token },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
