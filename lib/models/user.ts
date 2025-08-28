import mongoose, { Schema, Model } from 'mongoose';

// 1. Define the User Interface (Common for both Admin and Regular User)
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

// 2. Define the Mongoose Schemas

// Admin Schema (targets 'admins' collection)
const AdminSchema: Schema<UserData> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'admin', required: true }, // Default to admin for this schema
  cnic: { type: String, unique: true, sparse: true },
  profilePhoto: { type: String },
  rollNumber: { type: String },
  rollNoSlipUrl: { type: String },
}, {
  timestamps: true,
  collection: 'admins' // Explicitly targets the 'admins' collection
});

// Regular User Schema (targets 'users' collection)
const RegularUserSchema: Schema<UserData> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true }, // Default to user for this schema
  cnic: { type: String, unique: true, sparse: true },
  profilePhoto: { type: String },
  rollNumber: { type: String },
  rollNoSlipUrl: { type: String },
}, {
  timestamps: true,
  collection: 'users' // Explicitly targets the 'users' collection
});

// Configure toJSON for both schemas to ensure password is not included by default
AdminSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

RegularUserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// 3. Create the Mongoose Models (or get them if already defined)
// Export these models if you need to use them directly
export const Admin: Model<UserData> = mongoose.models.Admin || mongoose.model<UserData>('Admin', AdminSchema);
export const RegularUser: Model<UserData> = mongoose.models.RegularUser || mongoose.model<UserData>('RegularUser', RegularUserSchema);

// 4. Database Helper Functions
// We'll create specific helpers for each model for clarity and type safety.

// --- Admin Helper Functions ---
export async function createAdmin(userData: Omit<UserData, '_id' | '__v' | 'rollNoSlipUrl' | 'rollNumber'>): Promise<UserData> {
  try {
    const newAdmin = new Admin({ ...userData, role: 'admin' }); // Ensure role is admin
    const savedAdmin = await newAdmin.save();
    return savedAdmin.toJSON() as UserData;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw new Error(`Failed to create admin user: ${(error as Error).message}`);
  }
}

export async function findAdminByEmail(email: string, includePassword: boolean = false): Promise<UserData | null> {
  try {
    let query = Admin.findOne({ email });
    if (includePassword) {
      query = query.select('+password');
    }
    const admin = await query.lean();
    return admin ? admin as UserData : null;
  } catch (error) {
    console.error(`Error finding admin by email ${email}:`, error);
    throw new Error(`Failed to find admin by email: ${(error as Error).message}`);
  }
}

export async function findAdminById(id: string): Promise<UserData | null> {
  try {
    const admin = await Admin.findById(id).lean();
    return admin ? admin as UserData : null;
  } catch (error) {
    console.error(`Error finding admin by ID ${id}:`, error);
    throw new Error(`Failed to find admin by ID: ${(error as Error).message}`);
  }
}

export async function updateAdminProfile(id: string, updates: Partial<UserData>): Promise<boolean> {
  try {
    const result = await Admin.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: updates });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error(`Error updating admin profile for ID ${id}:`, error);
    throw new Error(`Failed to update admin profile: ${(error as Error).message}`);
  }
}

export async function findAllAdmins(): Promise<UserData[]> {
  try {
    const admins = await Admin.find({}).lean();
    return admins.map(admin => admin as UserData);
  } catch (error) {
    console.error("Error finding all admins:", error);
    throw new Error(`Failed to retrieve admins: ${(error as Error).message}`);
  }
}


// --- Regular User Helper Functions ---
export async function createRegularUser(userData: Omit<UserData, '_id' | '__v' | 'rollNoSlipUrl' | 'rollNumber'>): Promise<UserData> {
  try {
    const newUser = new RegularUser({ ...userData, role: 'user' }); // Ensure role is user
    const savedUser = await newUser.save();
    return savedUser.toJSON() as UserData;
  } catch (error) {
    console.error("Error creating regular user:", error);
    throw new Error(`Failed to create regular user: ${(error as Error).message}`);
  }
}

export async function findRegularUserByEmail(email: string, includePassword: boolean = false): Promise<UserData | null> {
  try {
    let query = RegularUser.findOne({ email });
    if (includePassword) {
      query = query.select('+password');
    }
    const user = await query.lean();
    return user ? user as UserData : null;
  } catch (error) {
    console.error(`Error finding regular user by email ${email}:`, error);
    throw new Error(`Failed to find regular user by email: ${(error as Error).message}`);
  }
}

export async function findRegularUserById(id: string): Promise<UserData | null> {
  try {
    const user = await RegularUser.findById(id).lean();
    return user ? user as UserData : null;
  } catch (error) {
    console.error(`Error finding regular user by ID ${id}:`, error);
    throw new Error(`Failed to find regular user by ID: ${(error as Error).message}`);
  }
}

export async function updateRegularUserProfile(id: string, updates: Partial<UserData>): Promise<boolean> {
  try {
    const result = await RegularUser.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: updates });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error(`Error updating regular user profile for ID ${id}:`, error);
    throw new Error(`Failed to update regular user profile: ${(error as Error).message}`);
  }
}

export async function findAllRegularUsers(): Promise<UserData[]> {
  try {
    const users = await RegularUser.find({}).lean();
    return users.map(user => user as UserData);
  } catch (error) {
    console.error("Error finding all regular users:", error);
    throw new Error(`Failed to retrieve regular users: ${(error as Error).message}`);
  }
}
