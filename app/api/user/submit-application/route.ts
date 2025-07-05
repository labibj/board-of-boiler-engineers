import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; // Assuming this path is correct
import { createApplication } from "@/lib/models/application"; // Assuming this path and function are correct
import jwt from "jsonwebtoken";

// Define JWT payload type
interface JwtPayload {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT token and extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded._id;
    const userEmail = decoded.email;

    // Extract all form fields (text + files)
    const fields: Record<string, string> = {};
    formData.forEach((value, key) => {
      // Only store non-file fields as strings
      if (typeof value === "string") {
        fields[key] = value;
      }
    });

    // Helper function to upload file to Cloudinary
    const uploadFile = async (file: FormDataEntryValue | null): Promise<string | null> => {
      // Check if the value is actually a File object
      if (!file || !(file instanceof File)) {
        console.warn(`Skipping upload for non-file or null value: ${file}`);
        return null;
      }

      // Convert file to base64 data URI
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mime = file.type;
      const dataUri = `data:${mime};base64,${base64}`;

      // Upload to Cloudinary
      const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: "boiler-applications", // Specify a folder in Cloudinary
      });

      return uploaded.secure_url; // Return the secure URL of the uploaded file
    };

    // Upload all required files
    const frontIdCardUrl = await uploadFile(formData.get("frontIdCard"));
    const backIdCardUrl = await uploadFile(formData.get("backIdCard"));
    const profilePhotoUrl = await uploadFile(formData.get("profilePhoto"));
    const feeSlipUrl = await uploadFile(formData.get("feeSlip"));
    // New: Upload certificate/diploma file
    const certificateDiplomaFileUrl = await uploadFile(formData.get("certificateDiplomaFile"));
    // New: Upload service letter file
    const serviceLetterUrl = await uploadFile(formData.get("serviceLetter"));

    // Prepare application data for storage
    const applicationData = {
      ...fields, // Include all text fields
      frontIdCard: frontIdCardUrl,
      backIdCard: backIdCardUrl,
      profilePhoto: profilePhotoUrl,
      feeSlip: feeSlipUrl,
      certificateDiplomaFile: certificateDiplomaFileUrl, // Add new file URL
      serviceLetter: serviceLetterUrl, // Add new file URL
      submittedBy: { userId, email: userEmail }, // User who submitted the application
      submittedAt: new Date(), // Timestamp of submission
    };

    // Create the application entry in your database (e.g., MongoDB)
    // The `createApplication` function should handle saving this data.
    const result = await createApplication(applicationData);

    // Respond with success
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("Form Submission Error:", err);
    // Provide a more descriptive error message in production, but for debugging, this is fine.
    return NextResponse.json({ error: "Failed to submit application", details: (err as Error).message }, { status: 500 });
  }
}
