import { MongoClient } from "mongodb";

if (!process.env.NEXT_PUBLIC_MONGO_DB_URL) {
  throw new Error(
    'Invalid/Missing environment variable: "NEXT_PUBLIC_MONGO_DB_URL"'
  );
}

const uri = process.env.NEXT_PUBLIC_MONGO_DB_URL;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare const global: {
  _mongoClientPromise?: Promise<MongoClient>;
} & typeof globalThis;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
