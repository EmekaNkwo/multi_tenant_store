import { redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/lib/auth";

interface RequireAuthLayoutProps {
  children: React.ReactNode;
}

export default async function RequireAuthLayout({
  children,
}: RequireAuthLayoutProps) {
  const user = await getAuthenticatedUser();

  if (!user) redirect("/login");

  return <>{children}</>;
}
