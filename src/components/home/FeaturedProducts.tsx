import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { getBaseUrl } from "@/lib/baseUrl";

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group">
          <Link
            href={`/products/${product.id}`}
            className=" bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
          >
            <div className="relative aspect-square bg-gray-100">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title ?? ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              )}
              {product.discountPrice && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Sale
                </span>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                {product.title}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-lg font-bold text-gray-900">
                      ${product.discountPrice?.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product?.price?.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    ${product?.price?.toFixed(2)}
                  </span>
                )}
              </div>
              <Link
                href={
                  process.env.NODE_ENV === "development"
                    ? `http://${product.store?.subdomain}.localhost:3000`
                    : `https://${product.store?.subdomain}.${new URL(getBaseUrl()).hostname}`
                }
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="mt-2 text-sm text-gray-500 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {product.store?.name ?? ""}
              </Link>
              <div className="mt-3 text-sm text-primary font-medium group-hover:underline">
                View Product →
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
