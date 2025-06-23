import Store from "@/app/api/models/Store";
import { connectDB } from "./db";
import Order from "@/app/api/models/Order";

export async function getPlatformStats() {
  await connectDB();

  const [activeStores, ordersResult, revenueResult] = await Promise.all([
    Store.countDocuments(),
    Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$total" } } },
    ]),
    Order.aggregate([
      { $match: { payoutStatus: "pending" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
  ]);

  return {
    activeStores,
    totalRevenue: revenueResult[0]?.total || 0,
    pendingPayouts: ordersResult[0]?.total || 0,
    newOrders: ordersResult[0]?.count || 0,
  };
}
