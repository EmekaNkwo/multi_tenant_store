import { getAuthenticatedUser } from "@/lib/auth";
import Order from "../models/Order";
import { errorResponse, successResponse } from "@/helpers/format-api-response";

export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser();
    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    // Get query parameters for filtering/sorting
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build the query
    const query: any = { userId: user._id.toString() };

    // Add status filter if provided
    if (
      status &&
      ["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        status
      )
    ) {
      query.status = status;
    }

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    // Get paginated orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return successResponse({
      data: orders,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return errorResponse("Failed to fetch orders", 500);
  }
}
