import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";

import { Lucia, Session, User } from "lucia";
import { Google } from "arctic";
import { cookies } from "next/headers";
import { cache } from "react";
import { getBaseUrl } from "./baseUrl";
import { Collection, MongoClient } from "mongodb";
import { connectDB } from "./db";
import UserModel from "@/app/api/models/User";

interface UserDoc {
  _id: string; // MongoDB ObjectId as string (Lucia converts it to string)
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
  role: string;
}

interface SessionDoc {
  _id: string;
  user_id: string;
  expires_at: Date;
}

// Setup MongoDB client
const client = await new MongoClient(
  process.env.NEXT_PUBLIC_MONGO_DB_URL!
).connect();
const db = client.db(); // default DB from connection string

const userCollection: Collection<UserDoc> = db.collection<UserDoc>("users");
const sessionCollection: Collection<SessionDoc> =
  db.collection<SessionDoc>("sessions");

const adapter = new MongodbAdapter(sessionCollection, userCollection);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "auth_session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes._id.toString(),
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
      role: databaseUserAttributes.role,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  _id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
  role: string;
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${getBaseUrl()}/api/auth/callback/google`
);

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
    console.log(sessionId);
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}

    return result;
  }
);

export const getJWTSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return new TextEncoder().encode(secret);
};

export async function getAuthenticatedUser() {
  try {
    // Get the auth_session cookie value
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("auth_session")?.value;

    if (!sessionId) {
      return null;
    }

    // Connect to MongoDB
    await connectDB();

    // Find the user by session ID
    const user = await UserModel.findOne({ sessionId });

    if (!user) {
      // Clear invalid session cookie
      (
        await // Clear invalid session cookie
        cookies()
      ).set({
        name: "auth_session",
        value: "",
        expires: new Date(0),
        path: "/",
      });
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}
