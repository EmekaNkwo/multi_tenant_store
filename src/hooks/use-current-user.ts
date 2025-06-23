"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/redux/api/authApi";
import { handleApiError } from "@/helpers/error-handlers";

export interface CurrentUser {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  role: string;
}

interface UseCurrentUserReturn {
  user: CurrentUser | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCurrentUser = (options?: {
  requireAuth?: boolean;
  redirectTo?: string;
}): UseCurrentUserReturn => {
  const router = useRouter();
  const { requireAuth = false, redirectTo } = options || {};
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCurrentUserQuery({}, { skip: !requireAuth });

  useEffect(() => {
    if (requireAuth && !isLoading && !response?.data?.user && redirectTo) {
      router.push(redirectTo);
    }
  }, [requireAuth, isLoading, response, redirectTo, router]);

  // Handle error state
  let errorMessage = null;
  if (isError && error) {
    errorMessage = handleApiError(error);
  }

  return {
    user: response?.data?.data?.user || null,
    isLoading,
    isError,
    error: errorMessage,
    refetch,
  };
};
