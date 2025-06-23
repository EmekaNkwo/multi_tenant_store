import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "../ui/button";

export default function LibraryGrid({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative aspect-video bg-gray-100">
            {item.product.images?.[0] ? (
              <Image
                src={item.product.images[0]}
                alt={item.product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-medium">{item.product.title}</h3>
            <p className="text-gray-600 text-sm mt-1">
              Purchased on {format(new Date(item.purchasedAt), "MMM dd, yyyy")}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-2" />
                <span className="text-sm text-gray-600">{item.store.name}</span>
              </div>

              <Button asChild variant="outline" size="sm">
                <Link href={`/library/${item.id}`}>View Product</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
