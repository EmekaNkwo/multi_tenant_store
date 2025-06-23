import Link from "next/link";
import Image from "next/image";
import { StarRating } from "../reviews/StarRating";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative bg-gray-100">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-semibold">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center">
              <StarRating rating={product.rating} />
              <span className="text-gray-500 ml-1 text-sm">
                ({product.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
