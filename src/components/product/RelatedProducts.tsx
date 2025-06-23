import ProductCard from "@/components/product/ProductCard";
import { getRelatedProducts } from "@/lib/products";

export default async function RelatedProducts({
  storeId,
  categoryId,
  currentProductId,
}: {
  storeId: string;
  categoryId?: string;
  currentProductId: string;
}) {
  const products = await getRelatedProducts(
    storeId,
    categoryId,
    currentProductId
  );

  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
