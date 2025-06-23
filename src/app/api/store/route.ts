import { StoreService } from "@/app/api/services/store.service";
import { getAuthenticatedUser } from "../../../lib/auth";
import { NotificationService } from "../services/notification.service";
import { Store } from "@/types";
import { errorResponse, successResponse } from "@/helpers/format-api-response";

// GET /api/store - Get all stores
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit") as string, 10)
      : 10;

    const user = await getAuthenticatedUser();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const stores = await StoreService.getAllStores({ search, limit });

    return successResponse(stores, "Stores retrieved successfully");
  } catch (error) {
    console.error("Error fetching stores:", error);
    return errorResponse("Failed to fetch stores", 500);
  }
}

// POST /api/store - Create a new store
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.subdomain) {
      return errorResponse("Name and subdomain are required", 400);
    }

    // Check if subdomain is available
    const isAvailable = await StoreService.isSubdomainAvailable(data.subdomain);
    if (!isAvailable) {
      return errorResponse("Subdomain is already taken", 400);
    }

    // Create store with pending status
    const store = await StoreService.createStore({
      ...data,
      ownerId: user.id,
      status: "pending", // New stores require admin approval
      approved: false, // Explicitly mark as not approved
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await NotificationService.notifyAdminAboutNewStore(store as Store);

    return successResponse(
      {
        ...store,
      },
      "Store created successfully and is pending admin approval"
    );
  } catch (error) {
    console.error("Error creating store:", error);
    return errorResponse("Failed to create store", 500);
  }
}
