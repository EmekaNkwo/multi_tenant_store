import { getStoresCollection } from "./db";
import { getProductsCollection } from "./db";
import { ObjectId } from "mongodb";

export async function getProductBySlug(subdomain: string, slug: string) {
  const stores = await getStoresCollection();
  const store = await stores.findOne({ subdomain });
  if (!store) return null;

  const products = await getProductsCollection();
  const product = await products.findOne({
    storeId: store._id.toString(),
    slug,
  });
  return product;
}

export async function getRelatedProducts(
  storeId: string,
  categoryId?: string,
  excludeId?: string,
  limit = 4
) {
  const products = await getProductsCollection();

  const query: any = {
    storeId: storeId.toString(),
  };

  if (categoryId) {
    query.categoryId = categoryId.toString();
  }
  if (excludeId) {
    query._id = { $ne: new ObjectId(excludeId) };
  }

  const relatedProducts = await products.find(query).limit(limit).toArray();
  return relatedProducts;
}

export async function getProductsByTenant(subdomain: string) {
  const stores = await getStoresCollection();
  const products = await getProductsCollection();
  const store = await stores.findOne({ subdomain });
  if (!store) return null;
  return products.find({ storeId: store._id.toString() }).toArray();
}
