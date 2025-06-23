import { getBaseUrl } from "@/lib/baseUrl";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/`,
  prepareHeaders: (headers) => {
    const token = "";
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
