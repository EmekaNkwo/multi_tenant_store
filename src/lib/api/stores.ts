import { getStoresCollection } from "../db";

export async function getStoreBySubdomain(subdomain: string) {
  const stores = await getStoresCollection();
  return await stores.findOne({ subdomain });
}
