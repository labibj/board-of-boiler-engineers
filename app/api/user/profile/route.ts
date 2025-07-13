import { NextRequest, NextResponse } from "next/server";
import { findUserById, updateUserProfile, UserData } from "@/lib/models/user";
import jwt from "jsonwebtoken";
import { Storage } from '@google-cloud/storage';

// Define JWT payload type (assuming user tokens contain _id and email)
interface JwtPayload {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Initialize Google Cloud Storage
let gcsCredentials;
try {
  if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
    gcsCredentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY);
    console.log("Parsed GCS Credentials (first few chars):", JSON.stringify(gcsCredentials).substring(0, 100));
  } else {
    console.error("GCP_SERVICE_ACCOUNT_KEY is not set.");
  }
} catch (parseError) {
  console.error("Error parsing GCP_SERVICE_ACCOUNT_KEY:", parseError);
}

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: gcsCredentials,
});

const GCS_BUCKET_NAME = process.env.GCP_BUCKET_NAME;

// Helper function to upload file to Google Cloud Storage
const uploadFileToCloudStorage = async (file: FormDataEntryValue | null): Promise<string | null> => {
  if (!file || !(file instanceof File)) {
    console.warn(`Skipping upload for non-file or null value: ${file}`);
    return null;
  }

  if (!GCS_BUCKET_NAME) {
    console.error("GCS_BUCKET_NAME is not defined in environment variables.");
    return null;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name;
  const fileType = file.type;

  const uniqueFileName = `profile-photos/${Date.now()}-${fileName.replace(/\s/g, '_')}`;

  try {
    const bucket = storage.bucket(GCS_BUCKET_NAME);
    const fileRef = bucket.file(uniqueFileName);

    await fileRef.save(buffer, {
      contentType: fileType,
      // REMOVED: public: true, // This causes the error with Uniform bucket-level access
      resumable: false,
    });

    const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${uniqueFileName}`;
    console.log(`File uploaded to GCS: ${publicUrl}`);
    return publicUrl;

  } catch (gcsError) {
    console.error("Google Cloud Storage upload failed:", gcsError);
    return null;
  }
};

// GET handler for fetching user profile data
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    const userId = decoded._id;
    const user = await findUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const profileData = {
      name: user.name,
      email: user.email,
      cnic: user.cnic,
      profilePhoto: user.profilePhoto || null,
    };

    return NextResponse.json({ success: true, data: profileData });

  } catch (err) {
    console.error("Fetch User Profile Error:", err);
    return NextResponse.json({ error: "Failed to fetch user profile.", details: (err as Error).message }, { status: 500 });
  }
}

// PUT handler for updating user profile (specifically photo for now)
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    const userId = decoded._id;
    const formData = await req.formData();
    const profilePhotoFile = formData.get("profilePhotoFile");

    let newProfilePhotoUrl: string | null = null;

    if (profilePhotoFile) {
      newProfilePhotoUrl = await uploadFileToCloudStorage(profilePhotoFile);
      if (newProfilePhotoUrl === null) {
        return NextResponse.json({ error: "Failed to upload new profile photo to cloud storage." }, { status: 500 });
      }
    }

    const updateFields: Partial<UserData> = {};
    if (newProfilePhotoUrl !== null) {
      updateFields.profilePhoto = newProfilePhotoUrl;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: "No data provided for update." }, { status: 400 });
    }

    const success = await updateUserProfile(userId, updateFields);

    if (success) {
      return NextResponse.json({ success: true, message: "Profile updated successfully!", profilePhotoUrl: newProfilePhotoUrl });
    } else {
      return NextResponse.json({ error: "Failed to update profile in database." }, { status: 500 });
    }

  } catch (err) {
    console.error("Update User Profile Error:", err);
    return NextResponse.json({ error: "Failed to update user profile.", details: (err as Error).message }, { status: 500 });
  }
}
