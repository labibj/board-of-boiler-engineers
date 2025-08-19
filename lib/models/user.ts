import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs'; // Import bcryptjs for hashing

// 1. Define the User Interface
export interface UserData {
  _id: mongoose.Types.ObjectId; // Explicitly required
  name: string;
  email: string;
  password?: string; 
  role: 'user' | 'admin';
  cnic?: string;
  profilePhoto?: string;
  rollNumber?: string;
  rollNoSlipUrl?: string; 
  __v?: number;
}

// 2. Define the Mongoose Schema
const UserSchema: Schema<UserData> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
  cnic: { type: String, unique: true, sparse: true },
  profilePhoto: { type: String },
  rollNumber: { type: String },
  rollNoSlipUrl: { type: String }, 
}, {
  timestamps: true,
  collection: 'admins' // Explicitly set the collection name to 'admins'
});

// Configure toJSON to ensure password is not included by default
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Normalize email before saving (trim and lowercase)
UserSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.trim().toLowerCase();
  }
  next();
});

// 3. Create the Mongoose Model (or get it if already defined)
const User: Model<UserData> = mongoose.models.User || mongoose.model<UserData>('User', UserSchema);

// Export the User model
export { User };

// 4. Database Helper Functions

/**
 * Hashes a password using bcrypt with consistent configuration.
 * @param password The plaintext password to hash.
 * @returns The hashed password.
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Match the salt rounds used in your existing hash ($2a$10$)
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Creates a new user in the database.
 * @param userData The data for the new user (password is required).
 * @returns The newly created user document (without password).
 * @throws Error if password is missing or invalid.
 */
export async function createUser(userData: Omit<UserData, '_id' | '__v' | 'rollNoSlipUrl' | 'rollNumber'> & { password: string }): Promise<UserData> {
  try {
    // Ensure password is provided
    if (!userData.password) {
      throw new Error("Password is required to create a user.");
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(userData.password);
    const normalizedData = {
      ...userData,
      email: userData.email.trim().toLowerCase(),
      password: hashedPassword,
    };
    const newUser = new User(normalizedData);
    const savedUser = await newUser.save();
    return savedUser.toJSON() as UserData;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(`Failed to create user: ${(error as Error).message}`);
  }
}

/**
 * Finds a user by their email address.
 * @param email The email of the user to find.
 * @param includePassword If true, the password field will be included in the returned user object.
 * @returns The user document if found, otherwise null.
 */
export async function findUserByEmail(email: string, includePassword: boolean = false): Promise<UserData | null> {
  try {
    const trimmedEmail = email.trim();
    console.log(`findUserByEmail: Querying for email '${trimmedEmail}' in collection '${User.collection.name}'`);
    console.log(`findUserByEmail: Full query object:`, { email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } });

    let query = User.findOne({ email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } });
    if (includePassword) {
      query = query.select('+password');
    }
    const user = await query.lean();
    
    console.log(`findUserByEmail: Query result count: ${user ? 1 : 0}`);
    console.log(`findUserByEmail: Query result for '${trimmedEmail}': ${user ? 'User found.' : 'User NOT found.'}`);
    if (user) {
      console.log("Found user document (partial view):", { _id: user._id, email: user.email, role: user.role });
    }
    return user ? user as UserData : null;
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
    return user ? user as UserData : null;
  } catch (error) {
    console.error(`Error finding user by ID ${id}:`, error);
    throw new Error(`Failed to find user by ID: ${(error as Error).message}`);
  }
}

/**
 * Finds all users in the database.
 * @returns A promise that resolves to an array of UserData, or an empty array if none found.
 */
export async function findAllUsers(): Promise<UserData[]> {
  try {
    const users = await User.find({}).lean();
    return users.map(user => user as UserData);
  } catch (error) {
    console.error("Error finding all users:", error);
    throw new Error(`Failed to retrieve users: ${(error as Error).message}`);
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
    if (updates.email) {
      updates.email = updates.email.trim().toLowerCase();
    }
    if (updates.password) {
      updates.password = await hashPassword(updates.password); // Hash new password if updated
    }
    const result = await User.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: updates });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error(`Error updating user profile for ID ${id}:`, error);
    throw new Error(`Failed to update user profile: ${(error as Error).message}`);
  }
}