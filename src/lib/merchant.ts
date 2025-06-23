import { connectDB } from "./db";
import Order from "@/app/api/models/Order";
import Store, { IStore } from "@/app/api/models/Store";

export interface MerchantStats {
  totalRevenue: number;
  pendingPayouts: number;
  newOrders: number;
  // Add more stats as needed
}

export async function getMerchantStats(
  merchantId: string
): Promise<MerchantStats> {
  await connectDB();

  try {
    // Get the store owned by this merchant
    const store = (await Store.findOne({
      owner: merchantId,
    }).lean()) as IStore | null;
    if (!store) {
      throw new Error("Store not found for this merchant");
    }

    // Calculate total revenue (in cents)
    const totalRevenueResult = await Order.aggregate([
      {
        $match: {
          storeId: store._id,
          status: { $in: ["completed", "fulfilled"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    // Calculate pending payouts (in cents)
    const pendingPayoutsResult = await Order.aggregate([
      {
        $match: {
          storeId: store._id,
          status: "completed",
          payoutStatus: { $ne: "paid" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    // Count new orders (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newOrdersCount = await Order.countDocuments({
      storeId: store._id,
      createdAt: { $gte: oneWeekAgo },
    });

    return {
      totalRevenue: totalRevenueResult[0]?.total || 0,
      pendingPayouts: pendingPayoutsResult[0]?.total || 0,
      newOrders: newOrdersCount,
    };
  } catch (error) {
    console.error("Error fetching merchant stats:", error);
    // Return default values in case of error
    return {
      totalRevenue: 0,
      pendingPayouts: 0,
      newOrders: 0,
    };
  }
}

// Additional merchant-related functions can be added here
export async function getRecentOrders(merchantId: string, limit = 5) {
  await connectDB();

  const store = (await Store.findOne({
    owner: merchantId,
  }).lean()) as IStore | null;
  if (!store) {
    throw new Error("Store not found for this merchant");
  }

  return Order.find({ storeId: store._id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "name email")
    .lean();
}
