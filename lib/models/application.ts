// lib/models/application.ts
import clientPromise from "../mongodb"; // Assuming mongodb.ts is in the same lib folder
import { Collection, ObjectId } from "mongodb";

// Interface for an application document
export interface ApplicationData {
  _id?: ObjectId; // MongoDB ObjectId
  certificate?: string;
  fullName?: string;
  fatherName?: string;
  email?: string;
  mobile?: string;
  permanentAddress?: string;
  presentAddress?: string;
  dob?: string; // CHANGED: Single field for Date of Birth (MM/DD/YYYY)
  idCardNumber?: string;
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
  submittedBy?: {
    userId: string;
    email: string;
  };
  submittedAt: Date; // Ensure this is always a Date
  applicationId?: string; // Optional, if you have a separate app ID
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
  // Fix: Rename _id to _unusedId to satisfy ESLint's no-unused-vars rule
  const { _id: _unusedId, ...rest } = applicationData; 
  const dataToInsert = { ...rest, submittedAt: applicationData.submittedAt || new Date() };
  const insertResult = await collection.insertOne(dataToInsert);
  return insertResult;
}
