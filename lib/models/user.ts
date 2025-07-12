// lib/models/user.ts
import clientPromise from "../mongodb";
import { Collection, ObjectId } from "mongodb";

// Interface for a user document
export interface UserData {
  _id?: ObjectId;
  name: string;
  email: string;
  cnic: string; // Assuming CNIC is stored as 'cnic' in your DB
  profilePhoto?: string | null; // URL to Cloudinary photo
  password?: string; // Hashed password, optional for fetching
  // Add other fields from your user document as needed
}

// Function to get the users collection
async function getUsersCollection(): Promise<Collection<UserData>> {
  const client = await clientPromise;
  // Ensure this matches the DB name in your MONGODB_URI or MONGODB_DB_NAME env var
  const db = client.db(process.env.MONGODB_DB_NAME || "boiler_board");
  return db.collection<UserData>("users");
}

// Function to find a user by ID
export async function findUserById(userId: string): Promise<UserData | null> {
  const collection = await getUsersCollection();
  // MongoDB ObjectId requires a valid string, so wrap in try-catch or validate
  try {
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null;
  }
}

// Function to update a user's profile (specifically for photo for now)
export async function updateUserProfile(userId: string, updateData: Partial<UserData>): Promise<boolean> {
  const collection = await getUsersCollection();
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
    return result.modifiedCount === 1;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
}
