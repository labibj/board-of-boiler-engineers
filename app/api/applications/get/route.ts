import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const { db } = await connectDB();
    const applications = await db
      .collection("applications")
      .find({ email })
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error); // ✅ use it here
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
