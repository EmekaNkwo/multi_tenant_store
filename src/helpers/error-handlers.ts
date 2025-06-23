// src/helpers/error-handlers.ts

export interface ApiError {
  status: number;
  data?: {
    error?: string;
    message?: string;
    [key: string]: any;
  };
}

export interface ErrorHandlerOptions {
  defaultMessage?: string;
  statusMessages?: Record<number, string>;
}

export const handleApiError = (
  error: any,
  options: ErrorHandlerOptions = {}
): string => {
  const {
    defaultMessage = "An error occurred. Please try again later.",
    statusMessages = {
      400: "Bad request. Please check your input.",
      401: "Invalid email or password",
      403: "You do not have permission to perform this action.",
      404: "The requested resource was not found.",
      500: "An internal server error occurred. Please try again later.",
    },
  } = options;

  // Handle RTK Query error format
  if (error?.status) {
    const { status, data } = error as { status: number; data: any };
    const serverMessage = data?.error || data?.message;
    return serverMessage || statusMessages[status] || defaultMessage;
  }

  // Handle Axios-style error response
  if (error?.response) {
    const { status, data } = error.response as ApiError;
    const serverMessage = data?.error || data?.message;
    return serverMessage || statusMessages[status] || defaultMessage;
  }

  // Handle other error formats
  if (error?.message) {
    return error.message;
  }

  return defaultMessage;
};

// Utility function to handle API errors in async functions
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  options?: ErrorHandlerOptions
): Promise<{ data?: T; error?: string }> => {
  try {
    const data = await fn();
    return { data };
  } catch (error) {
    const errorMessage = handleApiError(error, options);
    return { error: errorMessage };
  }
};
