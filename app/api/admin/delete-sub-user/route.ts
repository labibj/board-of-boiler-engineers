// app/api/admin/delete-sub-user/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"; // Still needed for ObjectId conversion
// ⭐ FIX: Import the RegularUser model and findRegularUserById, deleteRegularUserById
import { RegularUser, findRegularUserById } from "@/lib/models/user";
import dbConnect from "@/lib/db"; // Import dbConnect

// Define JWT payload type for admin user
interface JwtPayload {
  _id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Ensure this API route is dynamically rendered and runs in Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(request: NextRequest) {
  try {
    console.log("Admin Delete Sub-User API: Starting request.");
    await dbConnect();
    console.log("Admin Delete Sub-User API: Database connection established or reused.");

    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      console.error("Admin Delete Sub-User API: Authorization Error: No token provided.");
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (jwtError) {
      console.error("Admin Delete Sub-User API: Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    if (decodedToken.role !== "admin") {
      console.error(`Admin Delete Sub-User API: Authorization Error: User ${decodedToken.email} is not an admin.`);
      return NextResponse.json({ error: "Forbidden: Only administrators can delete users." }, { status: 403 });
    }

    // Get the user ID to delete from query parameters or request body
    const { id } = await request.json(); // Assuming ID is sent in the body for DELETE

    if (!id) {
      console.error("Admin Delete Sub-User API: Validation Error: User ID is required for deletion.");
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    // ⭐ FIX: Check if the user exists in the RegularUser collection first
    const userToDelete = await findRegularUserById(id);
    if (!userToDelete) {
      console.error(`Admin Delete Sub-User API: User with ID ${id} not found in RegularUser collection.`);
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // ⭐ FIX: Delete the user using the RegularUser model
    const objectId = new mongoose.Types.ObjectId(id); // Convert string ID to ObjectId
    const deleteResult = await RegularUser.deleteOne({ _id: objectId });

    if (deleteResult.deletedCount === 0) {
      console.error(`Admin Delete Sub-User API: Failed to delete user with ID ${id}. No document found to delete.`);
      return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
    }

    console.log(`Admin Delete Sub-User API: User with ID ${id} (${userToDelete.email}) deleted successfully.`);
    return NextResponse.json({ success: true, message: "User deleted successfully!" });

  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Admin Delete Sub-User API: Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to delete user.", details: errorMessage }, { status: 500 });
  }
}
