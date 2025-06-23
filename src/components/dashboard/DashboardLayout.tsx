import { AdminSidebar } from "./AdminSidebar";
import { useSession } from "@/contexts/session-context";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await useSession();

  // Redirect if not admin or merchant
  if (!user || (user.role !== "admin" && user.role !== "merchant")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {user.role === "admin" ? (
        <AdminSidebar />
      ) : (
        <MerchantSidebar /> // Similar component for merchants
      )}

      <div className="flex-grow">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}

// Placeholder for merchant sidebar
function MerchantSidebar() {
  return (
    <div className="w-64 border-r h-full bg-white">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Seller Dashboard</h2>
      </div>
      {/* Merchant navigation items */}
    </div>
  );
}
