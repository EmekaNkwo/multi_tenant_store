import bcrypt from "bcryptjs";
import { lucia } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";
import { getUsersCollection } from "@/lib/db";
import { errorResponse, successResponse } from "@/helpers/format-api-response";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password || "");
    if (!isValidPassword) {
      return errorResponse("Invalid email or password", 401);
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Update user with session ID using MongoDB native driver
    const users = await getUsersCollection();
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          sessionId: session.id,
          lastLogin: new Date(),
        },
      }
    );

    // Create response
    const response = successResponse(
      {
        user: {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      "User logged in successfully"
    );

    // Set the session cookie
    response.cookies.set({
      name: sessionCookie.name,
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("An error occurred during login", 500);
  }
}
