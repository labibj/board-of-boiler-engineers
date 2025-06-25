import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

// ✅ Extend types only — do not redeclare actual variable
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // ✅ In development, reuse existing connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  // ✅ In production, always create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// ✅ Reusable DB connection export
export async function connectDB() {
  const client = await clientPromise;
  const db = client.db(); // Optionally: client.db("your-db-name")
  return { client, db };
}
