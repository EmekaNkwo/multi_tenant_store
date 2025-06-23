import { getStoreProducts, getStoreConfig } from "@/lib/stores";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilterSidebar from "@/components/product/ProductFilterSidebar";
import StoreHeader from "@/components/storefront/StoreHeader";

export default async function StoreHomePage({
  params,
  searchParams,
}: {
  params: { storeSubdomain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const storeConfig = await getStoreConfig(params.storeSubdomain);
  const products = await getStoreProducts(params.storeSubdomain, searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <StoreHeader storeConfig={storeConfig} />

      <div className="mt-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <ProductFilterSidebar
            categories={storeConfig?.categories || []}
            onFilterChange={() => {}}
          />
        </div>
        <div className="md:w-3/4">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
