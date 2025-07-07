import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { insertManyResults, getAllResults, deleteAllResults, ResultData } from "@/lib/models/result";
import jwt from "jsonwebtoken";
import { Readable } from "stream";
import csv from "csv-parser"; // Make sure to install: npm install csv-parser

// Define JWT payload type (assuming admin users have similar payload)
interface JwtPayload {
  _id: string;
  email: string;
  role: string; // Assuming 'admin' role for authorization
  iat?: number;
  exp?: number;
}

// Removed unused 'streamToString' function

// Helper to parse CSV string into an array of objects
// Changed 'any[]' to 'Record<string, string>[]' for better type specificity
async function parseCsvString(csvString: string): Promise<Record<string, string>[]> {
  const results: Record<string, string>[] = [];
  return new Promise((resolve, reject) => {
    Readable.from(csvString)
      .pipe(csv())
      .on('data', (data: Record<string, string>) => results.push(data)) // Specify type for 'data'
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

// POST handler for uploading and processing results CSV
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Admin User
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error("Authorization Error: No token found in Authorization header.");
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      // Optional: Check for admin role if your JWT includes it
      if (decoded.role !== 'admin') {
        console.error("Authorization Error: User is not an admin.");
        return NextResponse.json({ error: "Forbidden: Not an admin user." }, { status: 403 });
      }
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    const userId = decoded._id;
    const userEmail = decoded.email;

    // 2. Get the file from FormData
    const formData = await req.formData();
    const file = formData.get("resultFile"); // 'resultFile' will be the name of the input in the frontend

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded or invalid file type." }, { status: 400 });
    }

    // Ensure it's a CSV or Excel (for parsing, we'll assume CSV content)
    if (!file.type.includes("csv") && !file.type.includes("excel") && !file.type.includes("spreadsheetml")) {
        return NextResponse.json({ error: "Only CSV or Excel files are allowed." }, { status: 400 });
    }

    // 3. Upload original file to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    let cloudinaryUrl: string;
    try {
      const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: "boiler-results", // Dedicated folder for results
        resource_type: "raw", // Treat as raw file for CSV/Excel
        public_id: `${file.name.split('.')[0]}-${Date.now()}` // Unique public ID
      });
      cloudinaryUrl = uploaded.secure_url;
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError);
      return NextResponse.json({ error: "Failed to upload file to Cloudinary." }, { status: 500 });
    }

    // 4. Parse CSV content
    const csvString = buffer.toString('utf-8'); // Convert buffer to string for parsing
    let parsedResults: Record<string, string>[]; // Changed 'any[]' to 'Record<string, string>[]'
    try {
      parsedResults = await parseCsvString(csvString);
    } catch (parseError) {
      console.error("CSV parsing failed:", parseError);
      return NextResponse.json({ error: "Failed to parse CSV file. Ensure it's correctly formatted." }, { status: 400 });
    }

    // 5. Map parsed data to ResultData interface and add metadata
    const resultsToSave: ResultData[] = parsedResults.map(row => ({
      rollNumber: row['Roll Number'] || '', // Match CSV header names from your sample
      candidateName: row['Candidate Name'] || '',
      certificate: row['Certificate'] || '',
      dateOfExam: row['Date of Exam'] || '',
      paper1Marks: row['Paper 1 Marks'] || '',
      paper2Marks: row['Paper 2 Marks'] || '',
      paper3Marks: row['Paper 3 Marks'] || '',
      totalMarks: row['Total Marks'] || '',
      resultStatus: row['Result Status'] || '',
      remarks: row['Remarks'] || '',
      uploadedAt: new Date(),
      uploadedBy: { userId, email: userEmail },
      originalFileName: file.name,
      cloudinaryUrl: cloudinaryUrl,
    }));

    // 6. Clear existing results and insert new ones
    // This assumes you want to replace all previous results with the new upload.
    // If you want to append or handle updates, modify this logic.
    await deleteAllResults(); // Optional: Clear old results
    await insertManyResults(resultsToSave);

    return NextResponse.json({ success: true, message: "Results uploaded and processed successfully." });

  } catch (err) {
    console.error("Result Upload Error:", err);
    return NextResponse.json({ error: "Failed to upload and process results.", details: (err as Error).message }, { status: 500 });
  }
}

// GET handler for fetching all results
export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate Admin User (similar to POST)
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (decoded.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden: Not an admin user." }, { status: 403 });
      }
    } catch (jwtError) {
      console.error("Authorization Error: Invalid or expired token.", jwtError);
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
    }

    // 2. Fetch all results from MongoDB
    const results = await getAllResults();

    return NextResponse.json({ success: true, data: results });

  } catch (err) {
    console.error("Fetch Results Error:", err);
    return NextResponse.json({ error: "Failed to fetch results.", details: (err as Error).message }, { status: 500 });
  }
}
