import { NextRequest, NextResponse } from "next/server";
import { IncomingForm, Files, Fields, File } from "formidable";
import { IncomingMessage } from "http";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Helper to upload a file to Cloudinary
async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const result = await cloudinary.uploader.upload(file.filepath, {
    folder,
  });
  return result.secure_url;
}

// ✅ Helper to parse multipart form data using Formidable
function parseForm(req: IncomingMessage): Promise<{ fields: Fields; files: Files }> {
  const form = new IncomingForm({
    multiples: true,
    uploadDir: "/tmp",
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// ✅ POST Handler
export async function POST(req: NextRequest): Promise<Response> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fields, files } = await parseForm(req as unknown as IncomingMessage);
    const { db } = await connectDB();

    // Extract fields safely
    const rawEmail = fields.email;
    const userEmail = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail ?? "";

    // Extract single file or null
    const getFile = (f: File | File[] | undefined): File | null =>
      Array.isArray(f) ? f[0] : f || null;

    const frontIdUrl = files.frontIdCard ? await uploadToCloudinary(getFile(files.frontIdCard)!, "applications") : null;
    const backIdUrl = files.backIdCard ? await uploadToCloudinary(getFile(files.backIdCard)!, "applications") : null;
    const photoUrl = files.profilePhoto ? await uploadToCloudinary(getFile(files.profilePhoto)!, "applications") : null;
    const feeSlipUrl = files.feeSlip ? await uploadToCloudinary(getFile(files.feeSlip)!, "applications") : null;

    // Build application object
    const application = {
      ...Object.fromEntries(
        Object.entries(fields).map(([key, val]) => [key, Array.isArray(val) ? val[0] : val])
      ),
      email: userEmail,
      frontIdCard: frontIdUrl,
      backIdCard: backIdUrl,
      profilePhoto: photoUrl,
      feeSlip: feeSlipUrl,
      submittedAt: new Date(),
      applicationId: uuidv4(),
    };

    const result = await db.collection("applications").insertOne(application);

    return NextResponse.json({
      message: "Application submitted",
      applicationId: result.insertedId,
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
