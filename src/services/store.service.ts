{{ ... }}

  // Get random featured stores
  static async getFeaturedStores(limit: number = 10): Promise<StoreWithRelations[]> {
    const stores = await getStoresCollection();
    
    // First, get the total count of stores
    const totalStores = await stores.countDocuments();
    
    // If we have fewer stores than the limit, just return all stores
    if (totalStores <= limit) {
      const allStores = await stores.find().toArray();
      return Promise.all(allStores.map(store => this.mapStore(store)));
    }
    
    // Get a random sample of stores
    const randomStores = await stores.aggregate([
      { $sample: { size: limit } }
    ]).toArray();

    return Promise.all(randomStores.map(store => this.mapStore(store)));
  }

{{ ... }}
