"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/app/api/models/User";

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  await connectDB();

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = new User({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
  });

  await newUser.save();
  return newUser;
}

export async function loginUser(userData: { email: string; password: string }) {
  await connectDB();

  const user = await User.findOne({ email: userData.email });
  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await bcrypt.compare(userData.password, user.password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  return user;
}

export async function getUser() {}
