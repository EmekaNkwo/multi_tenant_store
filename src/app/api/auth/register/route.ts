import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { lucia } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";
import User from "../../models/User";

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, name, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      name,
      role,
      password: hashedPassword,
      isActive: true,
      sessionId: "",
    });

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    user.sessionId = session.id;
    await user.save();

    let json_response = {
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    };

    return new Response(JSON.stringify(json_response), {
      status: 201,
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
