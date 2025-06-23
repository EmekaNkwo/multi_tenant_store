import Store, { IStore } from "@/app/api/models/Store";
import { connectDB } from "./db";

import Product from "@/app/api/models/Product";

export async function getStoreConfig(subdomain: string) {
  await connectDB();

  const store = (await Store.findOne({ subdomain })
    .populate("categories", "name slug")
    .lean()) as IStore | null;

  if (!store) return null;

  return {
    ...store,
    branding: store.branding || {
      primaryColor: "#2563eb",
      secondaryColor: "#7c3aed",
      logoUrl: "",
      bannerUrl: "",
    },
  };
}

export async function getStoreProducts(subdomain: string, filters: any = {}) {
  await connectDB();

  const store = await Store.findOne({ subdomain });
  if (!store) return [];

  const query: any = { store: store._id };

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  if (filters.categories) {
    const categories = Array.isArray(filters.categories)
      ? filters.categories
      : [filters.categories];
    query.category = { $in: categories };
  }

  return Product.find(query).populate("category", "name").limit(50).lean();
}

export async function getFeaturedStores(limit = 6) {
  await connectDB();

  return Store.find({}).sort({ createdAt: -1 }).limit(limit).lean();
}

export async function getStoreById(id: string) {
  await connectDB();
  return Store.findById(id).lean();
}
