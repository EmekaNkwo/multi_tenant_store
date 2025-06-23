import Store, { IStore } from "@/app/api/models/Store";
import { connectDB } from "./db";

export async function getTenant(subdomain: string) {
  await connectDB();
  return Store.findOne({ subdomain }).lean();
}

export async function getTenantConfig(subdomain: string) {
  await connectDB();
  const store = (await Store.findOne({ subdomain })
    .select("name description subdomain branding categories")
    .populate("categories", "name slug")
    .lean()) as IStore | null;

  if (!store) return null;

  // Default branding if not configured
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

export async function getTenantByUserId(userId: string) {
  await connectDB();
  return Store.findOne({ owner: userId }).lean();
}

export async function createTenant(
  subdomain: string,
  userId: string,
  storeName: string
) {
  await connectDB();

  // Check if subdomain is available
  const existing = await Store.findOne({ subdomain });
  if (existing) {
    throw new Error("Subdomain is already taken");
  }

  const newStore = new Store({
    subdomain,
    owner: userId,
    name: storeName,
    branding: {
      primaryColor: "#2563eb",
      secondaryColor: "#7c3aed",
    },
  });

  await newStore.save();
  return newStore;
}

export async function getTenantBySubdomain(subdomain: string) {
  await connectDB();
  return Store.findOne({ subdomain }).lean();
}
