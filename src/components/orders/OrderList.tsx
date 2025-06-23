import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function OrderList({ orders }: { orders: any[] }) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Order #{order.orderNumber}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(order.createdAt), "MMM dd, yyyy - h:mm a")}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold">${order.total.toFixed(2)}</div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">
                  <span className="font-medium">Store:</span> {order.store.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Items:</span>{" "}
                  {order.items.length}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href={`/orders/${order.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
