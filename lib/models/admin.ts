// models/admin.ts

import { getDB } from "@/lib/mongodb";

export async function findAdminByEmail(email: string) {
  const db = await getDB();
  return db.collection("admins").findOne({ email });
}

export async function createAdmin(adminData: {
  email: string;
  password: string; // ideally hashed
  name?: string;
}) {
  const db = await getDB();
  return db.collection("admins").insertOne(adminData);
}
