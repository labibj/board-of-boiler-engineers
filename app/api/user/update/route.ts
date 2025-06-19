import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const body = await req.json(); // type can be inferred

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    await users.updateOne(
      { _id: new ObjectId(decoded.id) },
      { $set: body }
    );

    return NextResponse.json({ message: "✅ Profile updated successfully" });
  } catch (error: unknown) {
    console.error("Update error:", error);
    return NextResponse.json({ message: "❌ Server error" }, { status: 500 });
  }
}
