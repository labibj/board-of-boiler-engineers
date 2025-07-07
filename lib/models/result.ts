// lib/models/result.ts
import clientPromise from "../mongodb";
import { Collection, ObjectId } from "mongodb";

// Interface for a single result document, matching your CSV structure
export interface ResultData {
  _id?: ObjectId; // MongoDB ObjectId
  rollNumber: string;
  candidateName: string;
  certificate: string;
  dateOfExam: string; // Storing as string for simplicity, can be Date if needed
  paper1Marks: string; // Storing as string, convert to number if calculations are needed
  paper2Marks: string;
  paper3Marks: string;
  totalMarks: string;
  resultStatus: string;
  remarks: string;
  uploadedAt: Date;
  uploadedBy: {
    userId: string;
    email: string;
  };
  originalFileName: string;
  cloudinaryUrl: string;
}

// Function to get the results collection
async function getResultsCollection(): Promise<Collection<ResultData>> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME || "boiler-engineers"); // Use DB name from env or default
  return db.collection<ResultData>("results");
}

// Function to insert multiple results (e.g., from a CSV upload)
export async function insertManyResults(results: ResultData[]) {
  const collection = await getResultsCollection();
  // Ensure that _id is not present for new inserts, MongoDB will add it.
  // Create a shallow copy and delete _id if it exists, to satisfy strict linting.
  const resultsToInsert = results.map(result => {
    const newResult = { ...result }; // Create a shallow copy of the result object
    if (newResult._id) {
      delete newResult._id; // Delete the _id property from the copy
    }
    return newResult;
  });

  const insertResult = await collection.insertMany(resultsToInsert);
  return insertResult;
}

// Function to get all results
export async function getAllResults(): Promise<ResultData[]> {
  const collection = await getResultsCollection();
  const results = await collection.find({}).toArray();
  return results;
}

// Function to delete all results (useful for re-uploading)
export async function deleteAllResults() {
  const collection = await getResultsCollection();
  const deleteResult = await collection.deleteMany({});
  return deleteResult;
}
