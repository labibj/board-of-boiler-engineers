import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUserByIdentifier, updateUserProfile } from "@/lib/models/user"; // Import updated user model functions
import { uploadFileToCloudStorage } from "@/lib/gcs-upload"; // Import shared GCS upload utility

// Define JWT payload type for admin (assuming role: 'admin')
interface JwtPayload {
  _id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Admin User
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (decoded.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden: Not an admin user." }, { status: 403 });
      }
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    // 2. Get form data (PDF file and user identifier)
    const formData = await req.formData();
    const rollNoSlipFile = formData.get("rollNoSlipFile"); // Name of the file input in frontend
    const userIdentifier = formData.get("userIdentifier")?.toString(); // CNIC or Email

    if (!rollNoSlipFile || !(rollNoSlipFile instanceof File)) {
      return NextResponse.json({ error: "No roll number slip file uploaded or invalid file type." }, { status: 400 });
    }
    if (!userIdentifier) {
      return NextResponse.json({ error: "User identifier (CNIC or Email) is required." }, { status: 400 });
    }

    // Ensure it's a PDF
    if (rollNoSlipFile.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed for roll number slips." }, { status: 400 });
    }

    // 3. Find the target user in MongoDB
    const targetUser = await findUserByIdentifier(userIdentifier);
    if (!targetUser) {
      return NextResponse.json({ error: `User with identifier '${userIdentifier}' not found.` }, { status: 404 });
    }

    // 4. Upload the PDF to Google Cloud Storage
    const rollNoSlipUrl = await uploadFileToCloudStorage(rollNoSlipFile, "roll-no-slips"); // Specify folder
    if (rollNoSlipUrl === null) {
      return NextResponse.json({ error: "Failed to upload roll number slip to cloud storage." }, { status: 500 });
    }

    // 5. Update the user's document with the rollNoSlipUrl
    const updateSuccess = await updateUserProfile(targetUser._id!.toString(), { rollNoSlipUrl });

    if (updateSuccess) {
      return NextResponse.json({ success: true, message: "Roll number slip uploaded and assigned successfully!" });
    } else {
      return NextResponse.json({ error: "Failed to update user's roll number slip in database." }, { status: 500 });
    }

  } catch (err) {
    console.error("Admin Roll No Slip Upload Error:", err);
    return NextResponse.json({ error: "Failed to upload roll number slip.", details: (err as Error).message }, { status: 500 });
  }
}
