import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { createApplication } from "@/lib/models/application";
import jwt from "jsonwebtoken";

// ✅ Define JWT payload type
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded._id;
    const userEmail = decoded.email;

    // ✅ Extract all form fields (text + files)
    const fields: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        fields[key] = value;
      }
    });

    // ✅ Helper function to upload file
    const uploadFile = async (file: FormDataEntryValue | null): Promise<string | null> => {
      if (!file || !(file instanceof File)) return null;

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mime = file.type;
      const dataUri = `data:${mime};base64,${base64}`;

      const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: "boiler-applications",
      });

      return uploaded.secure_url;
    };

    const frontIdCard = await uploadFile(formData.get("frontIdCard"));
    const backIdCard = await uploadFile(formData.get("backIdCard"));
    const profilePhoto = await uploadFile(formData.get("profilePhoto"));
    const feeSlip = await uploadFile(formData.get("feeSlip"));

    const applicationData = {
      ...fields,
      frontIdCard,
      backIdCard,
      profilePhoto,
      feeSlip,
      submittedBy: { userId, email: userEmail },
      submittedAt: new Date(),
    };

    const result = await createApplication(applicationData);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("Form Submission Error:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
