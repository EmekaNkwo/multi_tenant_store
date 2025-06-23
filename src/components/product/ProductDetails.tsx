"use client";

import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/reviews/StarRating";
import { useCart } from "@/hooks/use-cart";

import { useState } from "react";
import { toast } from "sonner";

export default function ProductDetails({ product }: { product: any }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.title,
      price: product.price,
      image: product.images?.[0]?.url || "",
    });

    toast.success(`${product.title} has been added to your cart`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <div className="flex items-center mt-2">
          <StarRating rating={product.rating} />
          <span className="ml-2 text-gray-600">
            ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      <div className="text-3xl font-semibold">${product.price.toFixed(2)}</div>

      <div className="prose max-w-none text-gray-700">
        <p>{product.description}</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </Button>
          <span className="px-4">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </Button>
        </div>

        <Button onClick={handleAddToCart} size="lg">
          Add to Cart
        </Button>
      </div>

      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium">Category</h3>
            <p>{product.category?.name || "Uncategorized"}</p>
          </div>
          <div>
            <h3 className="font-medium">SKU</h3>
            <p>{product.sku || "N/A"}</p>
          </div>
          <div>
            <h3 className="font-medium">Stock</h3>
            <p>
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
