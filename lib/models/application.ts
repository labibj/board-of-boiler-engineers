// lib/models/application.ts
import clientPromise from "../mongodb";

// Updated ApplicationData interface with mostly optional fields
export interface ApplicationData {
  certificate?: string;
  fullName?: string;
  fatherName?: string;
  email?: string;
  mobile?: string;
  permanentAddress?: string;
  presentAddress?: string;
  day?: string;
  month?: string;
  year?: string;
  idCardNumber?: string;
  departmentName?: string;
  qualification?: string;
  degreeDay?: string;
  degreeMonth?: string;
  degreeYear?: string;
  frontIdCard?: string | null; // Changed to allow null
  backIdCard?: string | null;  // Changed to allow null
  profilePhoto?: string | null; // Changed to allow null
  feeSlip?: string | null;      // Changed to allow null
  certificateDiploma?: string;
  certificateDiplomaFile?: string | null; // Added and changed to allow null
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
  serviceLetter?: string | null; // Changed to allow null
  submittedBy?: {
    userId: string;
    email: string;
  };
  submittedAt: Date;
  applicationId?: string;
}

// Create new application document
export async function createApplication(applicationData: ApplicationData) {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection("applications").insertOne(applicationData);
  return result;
}
