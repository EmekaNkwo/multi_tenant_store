import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Order from "../../models/Order";
import User from "../../models/User";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const order = await Order.findOne({
      _id: new ObjectId(id),
    });

    const user = await User.findOne({
      _id: new ObjectId(order.userId),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only admin or the order owner can view the order
    if (order.userId !== user._id.toString()) {
      return NextResponse.json(
        { error: "Not authorized to view this order" },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH /api/order/[id] - Update order status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (
      !status ||
      !["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        status
      )
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await Order.findOne({
      _id: new ObjectId(id),
    });

    const user = await User.findOne({
      _id: new ObjectId(order.userId),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only admin or the order owner can update the status
    if (user.role !== "admin" && order.userId !== user._id.toString()) {
      return NextResponse.json(
        { error: "Not authorized to update this order" },
        { status: 403 }
      );
    }

    const result = await Order.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
