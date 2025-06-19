// app/api/user/update/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const db = await getDB();

  try {
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.id) },
      { $set: body }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No changes made" }, { status: 400 });
    }

    return NextResponse.json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
