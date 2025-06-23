import { NextResponse } from "next/server";

export interface ApiResponseOptions {
  status?: number;
  message?: string;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

/**
 * Formats API responses consistently across the application
 * @param data The data to include in the response
 * @param options Response options (status, message, headers)
 * @returns Formatted NextResponse with consistent structure
 */
export function formatApiResponse<T>(
  data: T | null,
  options: ApiResponseOptions = {}
): NextResponse<ApiResponse<T | null>> {
  const {
    status = 200,
    message = status >= 400 ? "An error occurred" : "Success",
    headers = {},
  } = options;

  const success = status >= 200 && status < 300;

  const responseBody: ApiResponse<T | null> = {
    success,
    message: success ? message : options.message || "An error occurred",
    data: success ? data : null,
    timestamp: new Date().toISOString(),
  };

  const response = NextResponse.json(responseBody, { status });

  // Add custom headers if provided
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Creates an error response with proper typing
 */
export function errorResponse(
  message: string,
  status: number = 500,
  error?: any
) {
  return formatApiResponse(null, {
    status,
    message,
  });
}

/**
 * Creates a success response with proper typing
 */
export function successResponse<T>(
  data: T,
  message: string = "Operation completed successfully",
  status: number = 200
) {
  return formatApiResponse(data, {
    status,
    message,
  });
}
