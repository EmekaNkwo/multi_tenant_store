"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";

const TenantContext = createContext(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState(null);
  const params = useParams();

  useEffect(() => {
    const subdomain = Array.isArray(params.subdomain)
      ? params.subdomain[0]
      : params.subdomain;

    if (subdomain) {
      // Fetch tenant data
      fetch(`/api/tenant/${subdomain}`)
        .then((res) => res.json())
        .then(setTenant);
    }
  }, [params.subdomain]);

  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
}

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
