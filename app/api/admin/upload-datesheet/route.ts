import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Storage } from '@google-cloud/storage';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

// Define JWT payload type (assuming admin tokens contain _id and email)
interface JwtPayload {
  _id: string;
  email: string;
  role: string; // Assuming admin role is included in the token
  iat?: number;
  exp?: number;
}

// Define max file size (12MB in bytes) for backend validation
const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12 MB

// Initialize Firebase Admin SDK (if not already done globally)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app); // Get Firestore instance

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
const uploadFileToCloudStorage = async (file: FormDataEntryValue | null, folder: string): Promise<string | null> => {
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

  const uniqueFileName = `${folder}/${Date.now()}-${fileName.replace(/\s/g, '_')}`;

  try {
    const bucket = storage.bucket(GCS_BUCKET_NAME);
    const fileRef = bucket.file(uniqueFileName);

    await fileRef.save(buffer, {
      contentType: fileType,
      resumable: false,
    });

    await fileRef.makePublic(); // This line is crucial for public access

    const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${uniqueFileName}`;
    console.log(`File uploaded to GCS: ${publicUrl}`);
    return publicUrl;

  } catch (gcsError) {
    console.error("Google Cloud Storage upload failed:", gcsError);
    return null;
  }
};

// POST handler for uploading date sheet
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (decoded.role !== 'admin') { // Ensure only admins can upload datesheets
        return NextResponse.json({ error: "Forbidden: Not an admin." }, { status: 403 });
      }
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    const adminId = decoded._id;
    const formData = await req.formData();
    const datesheetFile = formData.get("datesheet");
    const selectedClass = formData.get("class") as string;
    const selectedSession = formData.get("session") as string;

    if (!datesheetFile || !(datesheetFile instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Server-side validation for file size (12MB)
    if (datesheetFile.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json({ error: `File size exceeds the ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB limit.` }, { status: 400 });
    }

    // Optional: Server-side validation for file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(datesheetFile.type)) {
        return NextResponse.json({ error: "Invalid file type. Only PDF or image (JPG, PNG, GIF) files are allowed." }, { status: 400 });
    }


    // Upload the datesheet to GCS
    const datesheetUrl = await uploadFileToCloudStorage(datesheetFile, "datesheets");

    if (!datesheetUrl) {
      return NextResponse.json({ error: "Failed to upload date sheet to cloud storage." }, { status: 500 });
    }

    // Store the datesheet URL and metadata in Firestore
    // Using a document ID based on class and session for uniqueness
    const docId = `${selectedClass}-${selectedSession}`;
    const datesheetRef = doc(db, "datesheets", docId);

    await setDoc(datesheetRef, {
      url: datesheetUrl,
      class: selectedClass,
      session: selectedSession,
      uploadedAt: new Date(),
      uploadedBy: adminId,
    }, { merge: true }); // Use merge: true to update existing document or create new

    return NextResponse.json({ success: true, message: "Date sheet uploaded successfully!", url: datesheetUrl });

  } catch (err) {
    console.error("Upload Date Sheet Error:", err);
    return NextResponse.json({ error: "Failed to upload date sheet.", details: (err as Error).message }, { status: 500 });
  }
}

// GET handler for fetching a specific datesheet URL
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (decoded.role !== 'admin') { // Only admins can fetch datesheets (adjust as needed)
        return NextResponse.json({ error: "Forbidden: Not an admin." }, { status: 403 });
      }
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedClass = searchParams.get('class');
    const requestedSession = searchParams.get('session');

    let docRef;
    if (requestedClass && requestedSession) {
      docRef = doc(db, "datesheets", `${requestedClass}-${requestedSession}`);
    } else {
      docRef = doc(db, "datesheets", "current"); // Fallback to a generic 'current' if no specific params
    }

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json({ success: true, url: docSnap.data().url });
    } else {
      return NextResponse.json({ error: "No date sheet found for the specified criteria." }, { status: 404 });
    }

  } catch (err) {
    console.error("Fetch Date Sheet Error:", err);
    return NextResponse.json({ error: "Failed to fetch date sheet.", details: (err as Error).message }, { status: 500 });
  }
}
