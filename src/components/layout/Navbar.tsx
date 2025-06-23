"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Navbar() {
  const { user } = useCurrentUser({ requireAuth: true });

  return (
    <nav className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-10">
        <Link href="/" className="text-xl font-bold text-primary">
          Marketplace
        </Link>

        <div className="hidden md:flex space-x-6">
          {user?.role === "customer" && (
            <>
              <Link
                href="/orders"
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                My Orders
              </Link>
              <Link
                href="/wishlist"
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                Wishlist
              </Link>
            </>
          )}

          {/* Merchant Navigation */}
          {user?.role === "merchant" && (
            <>
              <Link
                href="/merchant/products"
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                My Products
              </Link>
              <Link
                href="/merchant/orders"
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                Orders
              </Link>
              <Link
                href="/merchant/analytics"
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                Analytics
              </Link>
            </>
          )}

          {/* Admin Navigation */}
          {user?.role === "admin" && (
            <>
              <Link
                href="/admin/users"
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                Users
              </Link>
              <Link
                href="/admin/stores"
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                Stores
              </Link>
              <Link
                href="/admin/transactions"
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                Transactions
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-4">
            {user?.role === "merchant" && (
              <Button asChild variant="outline" size="sm">
                <Link href="/merchant/dashboard">Merchant Dashboard</Link>
              </Button>
            )}
            {user?.role === "admin" && (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/dashboard">Admin Panel</Link>
              </Button>
            )}
            <UserDropdown user={user} />
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

function UserDropdown({ user }: { user: any }) {
  return (
    <div className="relative">
      <Button variant="ghost" className="flex items-center space-x-2">
        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </span>
        <span className="hidden md:inline">Account</span>
      </Button>
    </div>
  );
}
