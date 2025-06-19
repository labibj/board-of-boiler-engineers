// lib/mongodb.ts

import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, options).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri, options).connect();
}

// ✅ Helper to get DB easily
export async function getDB(): Promise<Db> {
  const client = await clientPromise;
  return client.db("boiler-engineers"); // Replace with your actual DB name
}

export default clientPromise;
