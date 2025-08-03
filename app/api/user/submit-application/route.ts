import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { createApplication, ApplicationStatus, findApplicationByUserId } from "@/lib/models/application";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

// Set SendGrid API Key. It's crucial to set this at the start of the file.
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// Define JWT payload type
interface JwtPayload {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Define the shape of the Cloudinary upload result
interface CloudinaryResult {
  secure_url: string;
  // Add other properties you might need from the result
}

// Define a type for the potential SendGrid error object returned by the library.
interface SendGridError {
  response?: {
    body?: {
      errors?: Array<{ message: string; field?: string; help?: string }>;
    } | string;
  };
}

// Type guard to check if an error object is a SendGridError
function isSendGridError(error: unknown): error is SendGridError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { _id: userId, email: userEmail } = decodedToken;

    // Check for an existing application to prevent duplicates
    const existingApplication = await findApplicationByUserId(userId);
    if (existingApplication) {
      return NextResponse.json({ error: "You have already submitted an application." }, { status: 409 });
    }

    const formData = await request.formData();
    
    // Validate required files
    const fileFields = ["frontIdCard", "backIdCard", "profilePhoto", "feeSlip", "serviceLetter"];
    for (const field of fileFields) {
      if (!formData.get(field)) {
        return NextResponse.json({ error: `Missing file: ${field}` }, { status: 400 });
      }
    }

    // Process and upload files to Cloudinary
    const fileUrls: { [key: string]: string } = {};
    for (const field of fileFields) {
      const file = formData.get(field) as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise<CloudinaryResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: `boiler-engineers/${userId}` },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        ).end(buffer);
      });
      fileUrls[field] = result.secure_url;
    }
    
    // Extract text fields and combine date fields
    const applicationData = {
      userId,
      certificate: formData.get("certificate") as string,
      fullName: formData.get("fullName") as string,
      fatherName: formData.get("fatherName") as string,
      email: formData.get("email") as string,
      mobile: formData.get("mobile") as string,
      permanentAddress: formData.get("permanentAddress") as string,
      presentAddress: formData.get("presentAddress") as string,
      dob: formData.get("dob") as string,
      idCardNumber: formData.get("idCardNumber") as string,
      departmentName: formData.get("departmentName") as string,
      qualification: formData.get("qualification") as string,
      degreeDate: formData.get("degreeDate") as string,
      issueDate: formData.get("issueDate") as string,
      biolerRegistryNo: formData.get("biolerRegistryNo") as string,
      heatingSurface: formData.get("heatingSurface") as string,
      workingPressure: formData.get("workingPressure") as string,
      factoryNameAddress: formData.get("factoryNameAddress") as string,
      candidateDesignation: formData.get("candidateDesignation") as string,
      actualTime: formData.get("actualTime") as string,
      dateStartService: formData.get("dateStartService") as string,
      certificateDiploma: formData.get("certificateDiploma") as string,
      status: "Pending" as ApplicationStatus, 
      submittedAt: new Date(),
      ...fileUrls,
    };

    const result = await createApplication(applicationData);
    const userName = applicationData.fullName || userEmail;

    // --- START ACTUAL EMAIL SENDING USING SENDGRID ---
    try {
      const msg = {
        to: userEmail,
        from: process.env.SENDGRID_FROM_EMAIL as string, // This must be a verified sender email in your SendGrid account.
        subject: 'Application Submission Confirmation - Board of Examination',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #004432;">Application Received!</h2>
              <p>Dear ${userName},</p>
              <p>Thank you for submitting your application to the Board of Examination (For Boiler Engineers). We have received your submission and it is now being reviewed by our team.</p>
              
              <h3 style="color: #004432;">Application Details:</h3>
              <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 8px;"><strong>Application ID:</strong> ${result.insertedId}</li>
                <li style="margin-bottom: 8px;"><strong>Full Name:</strong> ${applicationData.fullName}</li>
                <li style="margin-bottom: 8px;"><strong>Date of Submission:</strong> ${new Date().toLocaleDateString()}</li>
                <li style="margin-bottom: 8px;"><strong>Current Status:</strong> ${applicationData.status}</li>
              </ul>
              
              <p>We will notify you via email as soon as there is an update on your application status. You can also check the status from your user dashboard.</p>
              
              <p>If you have any questions, please do not hesitate to contact us.</p>
              
              <p>Sincerely,</p>
              <p><strong>The Board of Examination Team</strong></p>
            </div>
            <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
              This is an automated email, please do not reply.
            </p>
          </div>
        `,
      };
      await sgMail.send(msg);
      console.log(`Application confirmation email sent to ${userEmail}.`);
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (isSendGridError(error) && error.response?.body) {
        if (typeof error.response.body === 'string') {
          errorMessage = `SendGrid Error: ${error.response.body}`;
        } else if (error.response.body.errors && Array.isArray(error.response.body.errors)) {
          // Join the error messages for a clean log
          errorMessage = `SendGrid Errors: ${error.response.body.errors.map(e => e.message).join(', ')}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      console.error(
        `Failed to send application confirmation email to ${userEmail}:`,
        errorMessage
      );
    }

    return NextResponse.json({ success: true, id: result.insertedId, message: "Application submitted successfully! A confirmation email has been sent." });
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Form Submission Error:", error);
    return NextResponse.json({ error: "Failed to submit application", details: errorMessage }, { status: 500 });
  }
}
