import { NextRequest, NextResponse } from "next/server";
import { findUserById, updateUserProfile, UserData } from "@/lib/models/user";
import jwt from "jsonwebtoken";
import { Storage } from '@google-cloud/storage'; // Import Google Cloud Storage SDK

// Define JWT payload type (assuming user tokens contain _id and email)
interface JwtPayload {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Initialize Google Cloud Storage
// For Vercel, we'll use GCP_SERVICE_ACCOUNT_KEY env variable containing the JSON content.
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: process.env.GCP_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY)
    : undefined, // If the env var is not set, credentials will be undefined
});

const GCS_BUCKET_NAME = process.env.GCP_BUCKET_NAME; // Your GCS bucket name

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

  // Generate a unique file name to avoid collisions
  const uniqueFileName = `profile-photos/${Date.now()}-${fileName.replace(/\s/g, '_')}`; // Replace spaces for URL safety

  try {
    const bucket = storage.bucket(GCS_BUCKET_NAME);
    const fileRef = bucket.file(uniqueFileName);

    // Upload the buffer to GCS
    await fileRef.save(buffer, {
      contentType: fileType,
      public: true, // Make the uploaded file publicly accessible
      resumable: false, // For smaller files, resumable upload is not necessary
    });

    // Construct the public URL for the file
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
    // 1. Authenticate User
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

    // 2. Fetch user data from MongoDB
    const user = await findUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 3. Return relevant profile data (exclude sensitive info like password)
    const profileData = {
      name: user.name,
      email: user.email,
      cnic: user.cnic,
      profilePhoto: user.profilePhoto || null, // Provide existing photo URL
      // Add other fields you want to display
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
    // 1. Authenticate User
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

    // 2. Get form data (expecting FormData for file uploads)
    const formData = await req.formData();
    const profilePhotoFile = formData.get("profilePhotoFile"); // Name of the file input in frontend

    let newProfilePhotoUrl: string | null = null;

    if (profilePhotoFile) {
      // Use the new cloud storage upload function
      newProfilePhotoUrl = await uploadFileToCloudStorage(profilePhotoFile);
      if (newProfilePhotoUrl === null) {
        // Handle case where upload failed but file was present
        return NextResponse.json({ error: "Failed to upload new profile photo to cloud storage." }, { status: 500 });
      }
    }

    // 3. Prepare update data
    const updateFields: Partial<UserData> = {};
    if (newProfilePhotoUrl !== null) {
      updateFields.profilePhoto = newProfilePhotoUrl;
    }
    // If you add other editable fields to the form, extract them here:
    // const name = formData.get("name")?.toString();
    // if (name) updateFields.name = name;
    // ... and so on for other fields

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: "No data provided for update." }, { status: 400 });
    }

    // 4. Update user document in MongoDB
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
