import { ProductService } from "@/app/api/services/product.service";
import { getAuthenticatedUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/helpers/format-api-response";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return errorResponse("Store ID is required", 400);
    }

    const isInStore = await ProductService.isProductInStore(
      params.productId,
      storeId
    );

    return successResponse({ isInStore });
  } catch (error) {
    console.error("[PRODUCT_IN_STORE_GET]", error);
    return errorResponse("Internal error", 500);
  }
}
