import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { createApplication, ApplicationStatus, findApplicationByUserId } from "@/lib/models/application";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; // Import Nodemailer

// Define JWT payload type
interface JwtPayload {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// --- Nodemailer Transporter Configuration ---
// You will need to replace these with your actual SMTP details.
// For example, if using Gmail:
// host: 'smtp.gmail.com',
// port: 465, // or 587
// secure: true, // true for 465, false for other ports
// auth: {
//   user: process.env.EMAIL_USER, // Your email address
//   pass: process.env.EMAIL_PASS, // Your email password or app-specific password
// }
// If using SendGrid, Mailgun, etc., consult their documentation for SMTP details.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., 'smtp.sendgrid.net' or 'smtp.mailgun.org'
  port: parseInt(process.env.EMAIL_PORT || '587'), // e.g., 587 or 465
  secure: process.env.EMAIL_SECURE === 'true', // Use 'true' for port 465, 'false' for 587
  auth: {
    user: process.env.EMAIL_USER, // Your email address or API key username
    pass: process.env.EMAIL_PASS, // Your email password or API key
  },
});

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
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    const userId = decoded._id;
    const userEmail = decoded.email; // Get user's email from JWT
    const userName = formData.get("fullName") as string; // Get user's full name from form data

    // CNIC regex pattern: 5 digits - 7 digits - 1 digit
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    // Date format regex for MM/DD/YYYY
    const dateFormatRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/;

    // NEW: Check if user has already submitted an application
    const existingApplication = await findApplicationByUserId(userId);
    if (existingApplication) {
      return NextResponse.json({ error: "You have already submitted an application." }, { status: 409 });
    }

    // Extract all form fields (text + files)
    const fields: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        fields[key] = value;
      }
    });

    // Backend validation for CNIC and Dates
    if (!cnicPattern.test(fields.idCardNumber)) {
      return NextResponse.json({ error: "Invalid CNIC format. Must be 00000-0000000-0." }, { status: 400 });
    }
    if (!dateFormatRegex.test(fields.dob)) {
      return NextResponse.json({ error: "Invalid Date of Birth format. Must be MM/DD/YYYY." }, { status: 400 });
    }
    if (fields.degreeDate && !dateFormatRegex.test(fields.degreeDate)) {
      return NextResponse.json({ error: "Invalid Degree Date format. Must be MM/DD/YYYY." }, { status: 400 });
    }
    if (fields.issueDate && !dateFormatRegex.test(fields.issueDate)) {
      return NextResponse.json({ error: "Invalid Issue Date format. Must be MM/DD/YYYY." }, { status: 400 });
    }
    if (fields.dateStartService && !dateFormatRegex.test(fields.dateStartService)) {
      return NextResponse.json({ error: "Invalid Date Start of Service format. Must be MM/DD/YYYY." }, { status: 400 });
    }


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

    // --- ACTUAL EMAIL SENDING ---
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM, // Your sender email address (e.g., 'no-reply@yourdomain.com')
        to: userEmail,
        subject: 'Application Submission Confirmation - Board of Examination',
        html: `
          <p>Dear ${userName},</p>
          <p>Thank you for submitting your application to the Board of Examination (For Boiler Engineers).</p>
          <p>Your application has been received and is currently under review. We will notify you of its status as soon as possible.</p>
          <p>For any queries, please do not hesitate to contact us.</p>
          <p>Sincerely,</p>
          <p>The Board of Examination Team</p>
          <hr>
          <p><small>This is an automated email, please do not reply.</small></p>
        `,
      });
      console.log(`Application confirmation email sent to ${userEmail}.`);
    } catch (emailError) {
      console.error(`Failed to send application confirmation email to ${userEmail}:`, emailError);
      // Decide if you want to return an error to the user or just log it and proceed
      // For critical applications, you might want to return a 500 here.
      // For now, we'll log and proceed, as the application itself was submitted.
    }
    // --- END ACTUAL EMAIL SENDING ---

    return NextResponse.json({ success: true, id: result.insertedId, message: "Application submitted successfully! A confirmation email has been sent." });
  } catch (err) {
    console.error("Form Submission Error:", err);
    return NextResponse.json({ error: "Failed to submit application", details: (err as Error).message }, { status: 500 });
  }
}
