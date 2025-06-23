// src/app/api/tenant/[subdomain]/products/route.ts
import { NextResponse } from "next/server";
import { validateTenant } from "@/middleware/tenant";
import { getProductsByTenant } from "@/lib/products";
import { validateRequest } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { subdomain: string } }
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await getProductsByTenant(params.subdomain);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenant products" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { subdomain: string } }
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
