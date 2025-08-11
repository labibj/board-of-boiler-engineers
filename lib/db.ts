import mongoose, { Mongoose } from 'mongoose';

// Check if MONGODB_URI is defined
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local or Vercel config.');
}

// Define the shape of our cached object for Mongoose connection
interface CachedMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Declare cached with its specific type and explicitly assert global.mongoose's type
const cached: CachedMongoose = (global.mongoose as CachedMongoose | undefined) || { conn: null, promise: null };

async function dbConnect() {
  // If a connection is already established, return it
  if (cached.conn) {
    console.log("Using cached Mongoose connection.");
    return cached.conn;
  }

  // If there's no ongoing connection promise, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose's buffering (we want explicit connection)
      // Removed: useNewUrlParser: true, // Deprecated
      // Removed: useUnifiedTopology: true, // Deprecated
      serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // Add non-null assertion operator (!) to MONGODB_URI
    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log("Mongoose connected successfully.");
        return mongooseInstance;
      })
      .catch(err => {
        console.error("Mongoose connection failed:", err);
        cached.promise = null; // Reset promise on failure to allow retry
        throw err; // Re-throw to propagate the error
      });
  }

  // Await the connection promise and cache the connection instance
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null; // Ensure promise is reset if `await` fails
    throw e; // Re-throw to propagate the error
  }
}

export default dbConnect;
