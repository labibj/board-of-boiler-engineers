import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    // Example: Get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // TODO: Verify token logic here (e.g., using jwt.verify)

    return NextResponse.next();

  } catch {
    // If error occurs, return 500 response
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
