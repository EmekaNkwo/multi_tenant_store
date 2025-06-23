import { errorResponse, successResponse } from "@/helpers/format-api-response";
import { StoreService } from "../../services/store.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit") as string, 10)
      : 10;

    const stores = await StoreService.getFeaturedStores(limit);

    return successResponse(stores, "Featured stores retrieved successfully");
  } catch (error) {
    console.error("Error fetching featured stores:", error);
    return errorResponse("Failed to fetch featured stores", 500);
  }
}

export const dynamic = "force-dynamic";
