import { ProductService } from "@/app/api/services/product.service";
import { productInputSchema } from "@/lib/validation";
import { getAuthenticatedUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/helpers/format-api-response";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return errorResponse("Authentication required", 401);
    }
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");
    const categoryId = searchParams.get("categoryId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await ProductService.getProducts({
      storeId: storeId || undefined,
      categoryId: categoryId || undefined,
      page,
      limit,
    });

    return successResponse(result);
  } catch (error) {
    return errorResponse("Internal error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    const body = await request.json();
    const validation = productInputSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(validation.error.message, 400);
    }

    const product = await ProductService.createProduct(validation.data);
    return successResponse(product, "Product created successfully", 201);
  } catch (error) {
    return errorResponse("Internal error", 500);
  }
}
