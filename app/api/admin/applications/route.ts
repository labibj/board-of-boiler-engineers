import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getApplications, updateApplicationStatus, ApplicationStatus } from "@/lib/models/application";
import { ObjectId } from "mongodb"; // Import ObjectId for converting string IDs

// Define JWT payload type for admin
interface JwtPayload {
  _id: string;
  email: string;
  role: string; // Assuming admin token has a 'role' field
  iat?: number;
  exp?: number;
}

// Helper to verify admin token
const verifyAdminToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (decoded.role !== 'admin') {
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Admin token verification failed:", error);
    return null;
  }
};

// GET all applications (for admin view)
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Not an authorized admin." }, { status: 403 });
    }

    // Optional: Filter by status if query parameter is present
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');
    const filter: any = {};
    if (statusFilter && ["Pending", "Accepted", "Cancelled", "Held"].includes(statusFilter)) {
      filter.status = statusFilter;
    }

    const applications = await getApplications(filter);

    // No need to destructure 'password' from 'app' because ApplicationData does not contain it.
    // The 'applications' array already contains only the fields defined in ApplicationData.
    // If you had a 'User' model and were fetching user data, you would filter password there.
    const safeApplications = applications; 

    return NextResponse.json({ success: true, applications: safeApplications });
  } catch (err) {
    console.error("Admin Get Applications Error:", err);
    return NextResponse.json({ error: "Failed to fetch applications.", details: (err as Error).message }, { status: 500 });
  }
}

// PUT/PATCH to update application status
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Not an authorized admin." }, { status: 403 });
    }

    const { applicationId, status, adminNotes } = await req.json();

    if (!applicationId || !status || !["Pending", "Accepted", "Cancelled", "Held"].includes(status)) {
      return NextResponse.json({ error: "Invalid application ID or status provided." }, { status: 400 });
    }

    const success = await updateApplicationStatus(applicationId, status as ApplicationStatus, adminNotes);

    if (success) {
      return NextResponse.json({ success: true, message: `Application status updated to '${status}' successfully.` });
    } else {
      return NextResponse.json({ error: "Failed to update application status. Application not found or no change." }, { status: 404 });
    }

  } catch (err) {
    console.error("Admin Update Application Status Error:", err);
    return NextResponse.json({ error: "Failed to update application status.", details: (err as Error).message }, { status: 500 });
  }
}
