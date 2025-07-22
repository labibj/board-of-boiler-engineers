import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { createApplication, ApplicationStatus, findApplicationByUserId } from "@/lib/models/application"; // Import findApplicationByUserId
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
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      console.error("Authorization Error: No token found in Authorization header.");
      return NextResponse.json({ error: "Unauthorized: No token provided in Authorization header." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      // Verify JWT token and extract user information
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    const userId = decoded._id;
    const userEmail = decoded.email;

    // NEW: Check if user has already submitted an application
    const existingApplication = await findApplicationByUserId(userId);
    if (existingApplication) {
      return NextResponse.json({ error: "You have already submitted an application." }, { status: 409 }); // 409 Conflict
    }

    // Extract all form fields (text + files)
    const fields: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        fields[key] = value;
      }
    });

    // Helper function to upload file to Cloudinary
    const uploadFile = async (file: FormDataEntryValue | null): Promise<string | null> => {
      if (!file || !(file instanceof File)) {
        console.warn(`Skipping upload for non-file or null value: ${file}`);
        return null;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mime = file.type;
      const dataUri = `data:${mime};base64,${base64}`;

      try {
        const uploaded = await cloudinary.uploader.upload(dataUri, {
          folder: "boiler-applications",
        });
        return uploaded.secure_url;
      } catch (cloudinaryError) {
        console.error(`Cloudinary upload failed for file type ${mime}:`, cloudinaryError);
        return null;
      }
    };

    // Upload all required files
    const frontIdCardUrl = await uploadFile(formData.get("frontIdCard"));
    const backIdCardUrl = await uploadFile(formData.get("backIdCard"));
    const profilePhotoUrl = await uploadFile(formData.get("profilePhoto"));
    const feeSlipUrl = await uploadFile(formData.get("feeSlip"));
    const certificateDiplomaFileUrl = await uploadFile(formData.get("certificateDiplomaFile"));
    const serviceLetterUrl = await uploadFile(formData.get("serviceLetter"));

    // Prepare application data for storage
    const applicationData = {
      ...fields,
      frontIdCard: frontIdCardUrl,
      backIdCard: backIdCardUrl,
      profilePhoto: profilePhotoUrl,
      feeSlip: feeSlipUrl,
      certificateDiplomaFile: certificateDiplomaFileUrl,
      serviceLetter: serviceLetterUrl,
      submittedBy: { userId, email: userEmail },
      submittedAt: new Date(),
      status: "Pending" as ApplicationStatus, // Set initial status
    };

    const result = await createApplication(applicationData);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("Form Submission Error:", err);
    return NextResponse.json({ error: "Failed to submit application", details: (err as Error).message }, { status: 500 });
  }
}
