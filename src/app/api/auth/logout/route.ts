import { lucia } from "@/lib/auth";
import { errorResponse } from "@/helpers/format-api-response";

export async function POST() {
  try {
    // Create a blank session cookie to clear the current session
    const sessionCookie = lucia.createBlankSessionCookie();

    return new Response(null, {
      status: 204,
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse("An error occurred during logout", 500);
  }
}
