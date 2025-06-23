import { ProductService } from "@/app/api/services/product.service";
import { getAuthenticatedUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/helpers/format-api-response";

export async function GET({ params }: { params: { productId: string } }) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    if (!params.productId) {
      return errorResponse("Product ID is required", 400);
    }

    const product = await ProductService.getProductById(params.productId);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(product);
  } catch (error) {
    return errorResponse("Internal error", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    const body = await request.json();
    const product = await ProductService.updateProduct(params.productId, body);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return errorResponse("Internal error", 500);
  }
}

export async function DELETE({ params }: { params: { productId: string } }) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    await ProductService.deleteProduct(params.productId, user.id);
    return successResponse(null, "Product deleted successfully", 200);
  } catch (error: any) {
    if (error.message === "Product not found") {
      return errorResponse("Product not found", 404);
    }
    if (error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 403);
    }
    console.error("[PRODUCT_DELETE]", error);
    return errorResponse("Internal error", 500);
  }
}
