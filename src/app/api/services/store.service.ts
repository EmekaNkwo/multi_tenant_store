import { ObjectId } from "mongodb";
import { Store, StoreBranding } from "@/types";
import { getStoresCollection, getUsersCollection } from "@/lib/db";

interface StoreDocument extends Omit<Store, "id" | "_id"> {
  _id: ObjectId;
}
export interface CreateStoreInput {
  name: string;
  subdomain: string;
  description?: string;
  ownerId: string;
  branding?: Partial<StoreBranding>;
}

export interface UpdateStoreInput {
  name?: string;
  description?: string | null;
  branding?: Partial<StoreBranding>;
}

export interface StoreWithRelations {
  _id: string;
  name: string;
  subdomain: string;
  description: string | null;
  owner: { id: string; name: string; email: string };
  branding: StoreBranding;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class StoreService {
  // Create a new store
  static async createStore(
    data: CreateStoreInput
  ): Promise<StoreWithRelations> {
    const stores = await getStoresCollection();
    const users = await getUsersCollection();

    const storeData = {
      name: data.name,
      subdomain: data.subdomain,
      description: data.description || null,
      ownerId: new ObjectId(data.ownerId),
      branding: {
        primaryColor: data.branding?.primaryColor || "#2563eb",
        secondaryColor: data.branding?.secondaryColor || "#7c3aed",
        logoUrl: data.branding?.logoUrl || "",
        bannerUrl: data.branding?.bannerUrl || "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await stores.insertOne(
      storeData as Omit<StoreDocument, "_id" | "ownerId">
    );
    const owner = await users.findOne(
      { _id: new ObjectId(data.ownerId) },
      { projection: { name: 1, email: 1 } }
    );

    return {
      ...storeData,
      _id: result.insertedId.toString(),
      owner: {
        id: owner?._id.toString() || "",
        name: owner?.name || "",
        email: owner?.email || "",
      },
      productCount: 0,
    };
  }

  // Get store by ID
  static async getStoreById(id: string): Promise<StoreWithRelations | null> {
    const stores = await getStoresCollection();
    const store = await stores.findOne({ _id: new ObjectId(id) });
    if (!store) return null;
    return this.mapStore(store);
  }

  // Get store by subdomain
  static async getStoreBySubdomain(
    subdomain: string
  ): Promise<StoreWithRelations | null> {
    const stores = await getStoresCollection();
    const store = await stores.findOne({ subdomain });
    if (!store) return null;
    return this.mapStore(store);
  }

  // Update store
  static async updateStore(
    id: string,
    data: UpdateStoreInput
  ): Promise<StoreWithRelations | null> {
    const stores = await getStoresCollection();
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.branding) {
      updateData.$set = {
        ...updateData.$set,
        ...Object.fromEntries(
          Object.entries(data.branding).map(([key, value]) => [
            `branding.${key}`,
            value,
          ])
        ),
      };
      delete updateData.branding;
    }

    const store = await stores.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return store ? this.mapStore(store) : null;
  }

  // Delete store
  static async deleteStore(id: string): Promise<boolean> {
    const stores = await getStoresCollection();
    const result = await stores.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Get all stores
  static async getAllStores(
    filters: {
      ownerId?: string;
      search?: string;
      limit?: number;
    } = {}
  ): Promise<StoreWithRelations[]> {
    const { ownerId, search, limit = 10 } = filters;
    const stores = await getStoresCollection();

    const query: any = {};
    if (ownerId) query.ownerId = new ObjectId(ownerId);
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { subdomain: { $regex: search, $options: "i" } },
      ];
    }

    const storeList = await stores
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return Promise.all(storeList.map((store) => this.mapStore(store)));
  }

  // Check if subdomain is available
  static async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const stores = await getStoresCollection();
    const existing = await stores.findOne({ subdomain });
    return !existing;
  }

  // Helper to map store document to StoreWithRelations
  private static async mapStore(store: any): Promise<StoreWithRelations> {
    const users = await getUsersCollection();
    const owner = await users.findOne(
      { _id: new ObjectId(store.ownerId) },
      { projection: { name: 1, email: 1 } }
    );

    const stores = await getStoresCollection();
    const productCount = await stores.countDocuments({ storeId: store._id });

    return {
      ...store,
      _id: store._id.toString(),
      owner: {
        id: owner?._id.toString(),
        name: owner?.name,
        email: owner?.email,
      },
      productCount,
    };
  }

  // Get random featured stores
  static async getFeaturedStores(
    limit: number = 10
  ): Promise<StoreWithRelations[]> {
    const stores = await getStoresCollection();

    // First, get the total count of stores
    const totalStores = await stores.countDocuments();

    // If we have fewer stores than the limit, just return all stores
    if (totalStores <= limit) {
      const allStores = await stores.find().toArray();
      return Promise.all(allStores.map((store) => this.mapStore(store)));
    }

    // Get a random sample of stores
    const randomStores = await stores
      .aggregate([{ $sample: { size: limit } }])
      .toArray();

    return Promise.all(randomStores.map((store) => this.mapStore(store)));
  }
}
