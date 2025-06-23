import { connectDB } from "./db";
import Order, { IOrder } from "@/app/api/models/Order";

export async function getOrders(userId: string): Promise<IOrder[]> {
  await connectDB();

  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .lean()
      .exec();

    // Convert to plain JavaScript objects and handle ObjectId serialization
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function getOrderById(
  orderId: string,
  userId: string
): Promise<IOrder | null> {
  await connectDB();

  try {
    const order = await Order.findOne({ _id: orderId, userId })
      .populate("items.productId", "name price images")
      .lean()
      .exec();

    return order ? JSON.parse(JSON.stringify(order)) : null;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export async function createOrder(
  orderData: Omit<IOrder, "_id" | "createdAt" | "updatedAt">
): Promise<IOrder> {
  await connectDB();

  const order = new Order(orderData);
  await order.save();

  return JSON.parse(JSON.stringify(order));
}

export async function updateOrderStatus(
  orderId: string,
  status: IOrder["status"],
  userId: string
): Promise<IOrder | null> {
  await connectDB();

  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, userId },
      { status },
      { new: true }
    )
      .lean()
      .exec();

    return order ? JSON.parse(JSON.stringify(order)) : null;
  } catch (error) {
    console.error("Error updating order status:", error);
    return null;
  }
}
