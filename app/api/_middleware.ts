import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // If you're not using token yet, skip assigning it
    // const token = authHeader.split(" ")[1];

    return NextResponse.next();

  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
