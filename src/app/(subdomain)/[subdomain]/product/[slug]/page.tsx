import { notFound } from "next/navigation";
import ProductImages from "@/components/product/ProductImages";
import ProductDetails from "@/components/product/ProductDetails";
import ReviewSection from "@/components/reviews/ReviewSection";
import RelatedProducts from "@/components/product/RelatedProducts";
import { getProductBySlug } from "@/lib/products";
import { Product } from "@/types";

export default async function ProductPage({
  params,
}: {
  params: { storeSubdomain: string; slug: string };
}) {
  const product = (await getProductBySlug(
    params.storeSubdomain,
    params.slug
  )) as Product | null;

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductImages images={product.images || []} />
        <ProductDetails product={product} />
      </div>

      <div className="mt-16 border-t pt-8">
        <ReviewSection productId={product.id} />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <RelatedProducts
          storeId={product.storeId || ""}
          categoryId={product.category?.id}
          currentProductId={product.id}
        />
      </div>
    </div>
  );
}
