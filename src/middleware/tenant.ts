// src/middleware/tenant.ts
import { NextResponse } from "next/server";
import { getTenantBySubdomain } from "@/lib/tenants";

export async function validateTenant(request: Request) {
  const url = new URL(request.url);
  const subdomain = url.hostname.split(".")[0];

  const tenant = await getTenantBySubdomain(subdomain);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  return { tenant, subdomain };
}
