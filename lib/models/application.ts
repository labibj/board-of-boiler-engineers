// lib/models/application.ts
import clientPromise from "../mongodb"; // Assuming mongodb.ts is in the same lib folder
import { Collection, ObjectId } from "mongodb";

// Define possible application statuses
export type ApplicationStatus = "Pending" | "Accepted" | "Cancelled" | "Held";

// Interface for an application document
export interface ApplicationData {
  _id?: ObjectId; // MongoDB ObjectId
  certificate?: string;
  fullName?: string; // Kept optional as per your provided code
  fatherName?: string; // Kept optional as per your provided code
  email?: string; // Kept optional as per your provided code
  mobile?: string; // Kept optional as per your provided code
  permanentAddress?: string; // Kept optional as per your provided code
  presentAddress?: string; // Kept optional as per your provided code
  dob?: string; // Single field for Date of Birth (MM/DD/YYYY) - Kept optional
  idCardNumber?: string; // Kept optional as per your provided code
  departmentName?: string;
  qualification?: string;
  degreeDay?: string;
  degreeMonth?: string;
  degreeYear?: string;
  frontIdCard?: string | null; // URL
  backIdCard?: string | null; // URL
  profilePhoto?: string | null; // URL
  feeSlip?: string | null; // URL
  certificateDiploma?: string;
  certificateDiplomaFile?: string | null; // URL
  issueDay?: string;
  issueMonth?: string;
  issueYear?: string;
  biolerRegistryNo?: string;
  heatingSurface?: string;
  workingPressure?: string;
  factoryNameAddress?: string;
  candidateDesignation?: string;
  actualTime?: string;
  dateStartService?: string;
  serviceLetter?: string | null; // URL
  submittedBy?: { // Kept optional, but will be present if submitted by a user
    userId: string;
    email: string;
  };
  submittedAt: Date; // Ensure this is always a Date
  applicationId?: string; // Optional, if you have a separate app ID
  status?: ApplicationStatus; // NEW: Status field, optional in interface but set on creation
  adminNotes?: string; // NEW: Optional field for admin comments
}

// Function to get the applications collection
async function getApplicationsCollection(): Promise<Collection<ApplicationData>> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME || "boiler_board"); // Use DB name from env or default
  return db.collection<ApplicationData>("applications");
}

// Function to create a new application
export async function createApplication(applicationData: ApplicationData) {
  const collection = await getApplicationsCollection();
  
  // Create a new object to insert, setting default status and submittedAt if not provided
  const dataToInsert: ApplicationData = {
    ...applicationData,
    submittedAt: applicationData.submittedAt || new Date(),
    status: applicationData.status || "Pending", // Default status to "Pending"
  };

  // Explicitly delete _id to ensure MongoDB generates a new one on insert
  // Removed: // eslint-disable-next-line no-unused-vars - No longer needed as no-unused-vars is not reported for _id
  delete dataToInsert._id; 

  const insertResult = await collection.insertOne(dataToInsert);
  return insertResult;
}

// Function to get applications (for admin)
// Changed 'filter: any' to a more specific type
export async function getApplications(filter: { status?: ApplicationStatus } = {}): Promise<ApplicationData[]> {
  const collection = await getApplicationsCollection();
  const applications = await collection.find(filter).sort({ submittedAt: -1 }).toArray();
  return applications;
}

// Function to update application status/notes (for admin)
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  adminNotes?: string
): Promise<boolean> {
  const collection = await getApplicationsCollection();
  // Changed 'updateDoc: any' to a more specific type for MongoDB update operators
  const updateDoc: { $set: { status: ApplicationStatus; adminNotes?: string } } = { $set: { status: status } };
  if (adminNotes !== undefined) { // Only set adminNotes if provided
    updateDoc.$set.adminNotes = adminNotes;
  }
  const result = await collection.updateOne(
    { _id: new ObjectId(applicationId) },
    updateDoc
  );
  return result.modifiedCount === 1;
}

// Function to find a single application by userId (for user)
export async function findApplicationByUserId(userId: string): Promise<ApplicationData | null> {
  const collection = await getApplicationsCollection();
  const application = await collection.findOne({ "submittedBy.userId": userId });
  return application;
}
