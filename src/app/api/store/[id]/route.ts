import { StoreService } from "@/app/api/services/store.service";
import { validateRequest } from "../../../../lib/auth";
import { errorResponse, successResponse } from "@/helpers/format-api-response";

// GET /api/store/[id] - Get store by ID
export async function GET({ params }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const store = await StoreService.getStoreById(params.id);
    if (!store) {
      return errorResponse("Store not found", 404);
    }
    return successResponse(store, "Store retrieved successfully");
  } catch (error) {
    console.error(`Error fetching store ${params.id}:`, error);
    return errorResponse("Failed to fetch store", 500);
  }
}

// PATCH /api/store/[id] - Update store
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const data = await request.json();
    const store = await StoreService.getStoreById(params.id);

    if (!store) {
      return errorResponse("Store not found", 404);
    }

    // Check if user is the owner
    if (store.owner.id !== user.id) {
      return errorResponse("Forbidden", 403);
    }

    const updatedStore = await StoreService.updateStore(params.id, data);
    return successResponse(updatedStore, "Store updated successfully");
  } catch (error) {
    console.error(`Error updating store ${params.id}:`, error);
    return errorResponse("Failed to update store", 500);
  }
}

// DELETE /api/store/[id] - Delete store
export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const store = await StoreService.getStoreById(params.id);
    if (!store) {
      return errorResponse("Store not found", 404);
    }

    // Check if user is the owner
    if (store.owner.id !== user.id) {
      return errorResponse("Forbidden", 403);
    }

    await StoreService.deleteStore(params.id);
    return successResponse(null, "Store deleted successfully");
  } catch (error) {
    console.error(`Error deleting store ${params.id}:`, error);
    return errorResponse("Failed to delete store", 500);
  }
}
