import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const path = url.pathname;

  // Skip for API routes, static files, and root domain
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/images") ||
    path.includes(".") ||
    !hostname // This handles cases where hostname might be undefined
  ) {
    return NextResponse.next();
  }

  // Parse the host (remove port for localhost)
  const host = hostname.split(":")[0];

  // If it's localhost or root domain
  if (host === "localhost" || host === "localhost:3000") {
    return NextResponse.next();
  }

  // Handle subdomains
  url.pathname = `/(subdomain)/[subdomain]${path}`;
  return NextResponse.rewrite(url);
}
