import { cookies } from "next/headers";
import { getUsersCollection } from "@/lib/db";
import { errorResponse, successResponse } from "@/helpers/format-api-response";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("auth_session")?.value;

    if (!sessionId) {
      return errorResponse("Not authenticated", 401);
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ sessionId });

    if (!user) {
      return errorResponse("Session expired", 401);
    }

    return successResponse({
      data: {
        user: {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    return errorResponse("Internal server error", 500);
  }
}
