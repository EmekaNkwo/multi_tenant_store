import User from "@/app/api/models/User";
import { connectDB } from "./db";

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export async function findUserById(userId: string) {
  await connectDB();
  const user = await User.findOne({ _id: userId });
  return user;
}

export async function findUserBySessionId(sessionId: string) {
  await connectDB();
  const user = await User.findOne({ sessionId });
  return user;
}

export async function findUserByEmail(email: string) {
  await connectDB();
  const user = await User.findOne({ email }).select("+password");
  return user;
}

export async function createUser(userData: ICreateUser) {
  await connectDB();
  const user = new User({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role,
  });
  await user.save();
  return user;
}
