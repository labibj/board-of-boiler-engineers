// app/api/admin/delete-sub-user/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "@/lib/models/user"; // Import the User model

// Define JWT payload type for admin user
interface JwtPayload {
  _id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function DELETE(request: NextRequest) {
  try {
    // 1. Authentication: Get and verify the admin's JWT token
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      console.error("Authorization Error: No token provided.");
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    // 2. Authorization: Check if the authenticated user has an 'admin' role
    if (decodedToken.role !== "admin") {
      console.error(`Authorization Error: User ${decodedToken.email} is not an admin.`);
      return NextResponse.json({ error: "Forbidden: Only administrators can delete users." }, { status: 403 });
    }

    // 3. Get the user ID from the request
    const { id } = await request.json();
    if (!id) {
      console.error("Validation Error: User ID is required.");
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    // 4. Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Validation Error: Invalid user ID format.");
      return NextResponse.json({ error: "Invalid user ID format." }, { status: 400 });
    }

    // 5. Check if the user exists and is not the admin deleting themselves
    const userToDelete = await User.findById(id).lean();
    if (!userToDelete) {
      console.error(`Not Found Error: User with ID ${id} not found.`);
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (userToDelete.email === decodedToken.email) {
      console.error("Validation Error: Cannot delete own account.");
      return NextResponse.json({ error: "Cannot delete your own account." }, { status: 403 });
    }

    // 6. Delete the user
    await User.findByIdAndDelete(id);
    console.log(`User with ID ${id} deleted successfully.`);

    return NextResponse.json({ success: true, message: "Sub-user deleted successfully!" });

  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete user", details: errorMessage }, { status: 500 });
  }
}