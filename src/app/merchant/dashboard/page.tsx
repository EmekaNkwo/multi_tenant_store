import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getCurrentUser } from "../../../lib/auth";
import { StripeConnectButton } from "@/components/payments/StripeConnectButton";
import { getMerchantStats } from "@/lib/merchant";

export default async function MerchantDashboard() {
  const user = await getCurrentUser();
  const stats = await getMerchantStats(user?.id!);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Store Dashboard</h1>
          {!user?.stripeAccountId && <StripeConnectButton userId={user?.id!} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${(stats.totalRevenue / 100).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${(stats.pendingPayouts / 100).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.newOrders}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>{/* Recent orders table */}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>{/* Product performance chart */}</CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
