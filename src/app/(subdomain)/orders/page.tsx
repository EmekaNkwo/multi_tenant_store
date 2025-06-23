"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OrderList from "@/components/orders/OrderList";
import { useGetOrdersQuery } from "@/redux/api/orderApi";

export default function OrdersPage() {
  const getOrderData = useGetOrdersQuery({});

  if (getOrderData.isLoading) {
    return <div className="max-w-4xl mx-auto p-6">Loading orders...</div>;
  }

  if (getOrderData.isError) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-red-500">
        Error loading orders
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {!getOrderData.data || getOrderData?.data?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't placed any orders yet</p>
          <Button asChild className="mt-4">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <OrderList orders={getOrderData?.data?.data} />
      )}
    </div>
  );
}
