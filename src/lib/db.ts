import { Category, Product, Store, User } from "@/types";
import { Collection, Document } from "mongodb";
import mongoose from "mongoose";

export const MONGODB_URI = process.env.NEXT_PUBLIC_MONGO_DB_URL as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

declare global {
  var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function clientPromise() {
  try {
    if (!cached.conn) {
      console.log("Connecting to MongoDB...");
      await connectDB();
    }
    if (!cached.conn) {
      throw new Error("Failed to establish database connection");
    }
    console.log("Connected to MongoDB");
    return {
      client: cached.conn.connection.getClient(),
      db: cached.conn.connection.db,
    };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

export function getCollection<T extends Document>(name: string) {
  return async (): Promise<Collection<T>> => {
    const { db } = await clientPromise();
    return db.collection(name);
  };
}

export const getStoresCollection = getCollection<Store>("stores");
export const getUsersCollection = getCollection<User>("users");
export const getProductsCollection = getCollection<Product>("products");
export const getCategoriesCollection = getCollection<Category>("categories");
