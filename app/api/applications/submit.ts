// pages/api/applications/submit.ts

import { IncomingForm, Fields, Files, File } from "formidable";
import { IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

function uploadToCloudinary(file: File, folder: string): Promise<string> {
  return cloudinary.uploader.upload(file.filepath, { folder }).then(res => res.secure_url);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const form = new IncomingForm({
    multiples: true,
    uploadDir: "/tmp",
    keepExtensions: true,
  });

  form.parse(req as IncomingMessage, async (_err: unknown, fields: Fields, files: Files) => {
    try {
      const { db } = await connectDB();

      const email = Array.isArray(fields.email) ? fields.email[0] : fields.email ?? "";

      const getFile = (f: File | File[] | undefined): File | undefined =>
        Array.isArray(f) ? f[0] : f;

      const frontIdCardFile = getFile(files.frontIdCard);
      const backIdCardFile = getFile(files.backIdCard);
      const profilePhotoFile = getFile(files.profilePhoto);
      const feeSlipFile = getFile(files.feeSlip);

      const frontIdUrl = frontIdCardFile ? await uploadToCloudinary(frontIdCardFile, "applications") : null;
      const backIdUrl = backIdCardFile ? await uploadToCloudinary(backIdCardFile, "applications") : null;
      const photoUrl = profilePhotoFile ? await uploadToCloudinary(profilePhotoFile, "applications") : null;
      const feeSlipUrl = feeSlipFile ? await uploadToCloudinary(feeSlipFile, "applications") : null;

      const application = {
        ...Object.fromEntries(
          Object.entries(fields).map(([key, val]) => [key, Array.isArray(val) ? val[0] : val])
        ),
        email,
        frontIdCard: frontIdUrl,
        backIdCard: backIdUrl,
        profilePhoto: photoUrl,
        feeSlip: feeSlipUrl,
        submittedAt: new Date(),
        applicationId: uuidv4(),
      };

      const result = await db.collection("applications").insertOne(application);

      return res.status(200).json({
        message: "Application submitted",
        applicationId: result.insertedId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  });
}
