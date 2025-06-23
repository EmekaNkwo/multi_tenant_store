import { ProductService } from "@/app/api/services/product.service";
import { getAuthenticatedUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/helpers/format-api-response";

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    const { quantity } = await request.json();

    if (typeof quantity !== "number") {
      return errorResponse("Quantity is required and must be a number", 400);
    }

    const product = await ProductService.updateInventory(
      params.productId,
      quantity,
      user.id
    );

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(product);
  } catch (error: any) {
    if (error.message === "Product not found") {
      return errorResponse("Product not found", 404);
    }
    if (error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 403);
    }
    console.error("[INVENTORY_PATCH]", error);
    return errorResponse("Internal error", 500);
  }
}
