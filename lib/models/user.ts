import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the User Interface
export interface UserData {
  name: string;
  email: string;
  password?: string; // Password is optional when fetching, but required for creation
  role: 'user' | 'admin';
  cnic?: string; // Assuming cnic is an optional field
  profilePhoto?: string; // URL to profile photo
}

// 2. Define the Mongoose Schema
const UserSchema: Schema<UserData> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // 'select: false' prevents password from being returned by default queries
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
  cnic: { type: String, unique: true, sparse: true }, // 'sparse: true' allows multiple null values
  profilePhoto: { type: String },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// 3. Create the Mongoose Model (or get it if already defined)
// This check prevents Mongoose from recompiling the model if it's already defined
const User: Model<UserData> = mongoose.models.User || mongoose.model<UserData>('User', UserSchema);

// 4. Database Helper Functions

/**
 * Creates a new user in the database.
 * @param userData The data for the new user.
 * @returns The newly created user document (without password).
 */
export async function createUser(userData: UserData): Promise<UserData> {
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    // Return a plain object without the password field
    const { password, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(`Failed to create user: ${(error as Error).message}`);
  }
}

/**
 * Finds a user by their email address.
 * @param email The email of the user to find.
 * @returns The user document if found, otherwise null.
 */
export async function findUserByEmail(email: string): Promise<UserData | null> {
  try {
    // We use .select('+password') if we need the password, otherwise it's excluded by default
    const user = await User.findOne({ email }).lean(); // .lean() returns a plain JS object
    return user;
  } catch (error) {
    console.error(`Error finding user by email ${email}:`, error);
    throw new Error(`Failed to find user by email: ${(error as Error).message}`);
  }
}

/**
 * Finds a user by their ID.
 * @param id The ID of the user to find.
 * @returns The user document if found, otherwise null.
 */
export async function findUserById(id: string): Promise<UserData | null> {
  try {
    const user = await User.findById(id).lean();
    return user;
  } catch (error) {
    console.error(`Error finding user by ID ${id}:`, error);
    throw new Error(`Failed to find user by ID: ${(error as Error).message}`);
  }
}

/**
 * Updates a user's profile by ID.
 * @param id The ID of the user to update.
 * @param updates The fields to update.
 * @returns True if the update was successful, false otherwise.
 */
export async function updateUserProfile(id: string, updates: Partial<UserData>): Promise<boolean> {
  try {
    const result = await User.updateOne({ _id: id }, { $set: updates });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error(`Error updating user profile for ID ${id}:`, error);
    throw new Error(`Failed to update user profile: ${(error as Error).message}`);
  }
}
