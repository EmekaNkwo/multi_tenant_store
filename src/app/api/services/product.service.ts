import {
  getCategoriesCollection,
  getProductsCollection,
  getStoresCollection,
} from "@/lib/db";
import { CreateProductInput, productInputSchema } from "@/lib/validation";
import { Product } from "@/types";
import { ObjectId } from "mongodb";

type ProductDocument = Omit<Product, "store" | "category" | "id"> & {
  _id: ObjectId;
  storeId: string;
  categoryId: ObjectId;
  store?: never;
  category?: never;
  id?: never;
};

export interface GetProductsParams {
  storeId?: string;
  categoryId?: string;
  isFeatured?: boolean;
  includeArchived?: boolean;
  page?: number;
  limit?: number;
}

export class ProductService {
  /**
   * Create a new product
   */
  static async createProduct(data: CreateProductInput): Promise<Product> {
    // Validate input
    const validation = productInputSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    const stores = await getStoresCollection();
    const products = await getProductsCollection();
    const categories = await getCategoriesCollection();

    // Check if store exists
    const store = await stores.findOne({
      _id: new ObjectId(data.storeId),
    });

    if (!store) {
      throw new Error("Store not found");
    }

    // Check if category exists in the store
    const category = await categories.findOne({
      _id: new ObjectId(data.categoryId),
      storeId: new ObjectId(data.storeId),
    });

    if (!category) {
      throw new Error("Category not found in this store");
    }

    // Generate a URL-friendly slug from the product name
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();

    const productData: ProductDocument = {
      _id: new ObjectId(),
      title: data.title,
      description: data.description || "",
      price: data.price,
      discountPrice: data.discountPrice,
      images: data.images,
      stock: data.stock || 0,
      storeId: data.storeId,
      categoryId: new ObjectId(data.categoryId),
      slug,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result = await products.insertOne(productData as any);

      if (!result.acknowledged) {
        throw new Error("Failed to create product");
      }

      // Fetch the created product with populated relations
      const product = await products.findOne(
        { _id: result.insertedId },
        {
          projection: {
            _id: 1,
            title: 1,
            description: 1,
            price: 1,
            discountPrice: 1,
            images: 1,
            stock: 1,
            tags: 1,
            isFeatured: 1,
            isArchived: 1,
            rating: 1,
            reviewCount: 1,
            slug: 1,
            storeId: 1,
            categoryId: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        }
      );

      if (!product) {
        throw new Error("Failed to fetch created product");
      }

      // Convert to expected format
      return {
        ...product,
        id: product._id.toString(),
        storeId: product.storeId.toString(),
        categoryId: product.category.id.toString(),
      } as unknown as Product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    const products = await getProductsCollection();
    const product = await products.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return null;
    }

    // Fetch related data
    const [store, category] = await Promise.all([
      (await getStoresCollection()).findOne({ _id: product.storeId }),
      (await getCategoriesCollection()).findOne({ id: product.category.id }),
    ]);

    if (!store || !category) {
      throw new Error("Associated store or category not found");
    }

    return {
      ...product,
      id: product._id.toString(),
      storeId: product.storeId.toString(),
      categoryId: product.category.id.toString(),
      store: {
        id: store._id.toString(),
        name: store.name || "",
        subdomain: store.subdomain,
      },
      category: {
        id: category._id.toString(),
        name: category.name || "",
        slug: category.slug || "",
      },
    } as unknown as Product;
  }

  /**
   * Get products with optional filtering and pagination
   */
  static async getProducts({
    storeId,
    categoryId,
    page = 1,
    limit = 10,
  }: GetProductsParams = {}): Promise<{
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const productsCollection = await getProductsCollection();
    const storesCollection = await getStoresCollection();
    const categoriesCollection = await getCategoriesCollection();

    // Build the query
    const query: any = {};
    if (storeId) query.storeId = new ObjectId(storeId);
    if (categoryId) query.categoryId = new ObjectId(categoryId);

    // Get total count
    const total = await productsCollection.countDocuments(query);

    // Fetch products with pagination
    const productDocs = await productsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    if (productDocs.length === 0) {
      return {
        products: [],
        total: 0,
        page,
        totalPages: 0,
      };
    }

    // Get all unique store and category IDs and convert to ObjectIds
    const storeIds = [...new Set(productDocs.map((p) => p.storeId.toString()))];
    const categoryIds = [
      ...new Set(productDocs.map((p) => p.category.id.toString())),
    ];

    // Convert string IDs to ObjectIds for the query
    const storeObjectIds = storeIds.map((id) => new ObjectId(id));
    const categoryObjectIds = categoryIds.map((id) => new ObjectId(id));

    // Fetch related data in parallel
    const [stores, categories] = await Promise.all([
      storesCollection.find({ _id: { $in: storeObjectIds } }).toArray(),
      categoriesCollection.find({ _id: { $in: categoryObjectIds } }).toArray(),
    ]);

    // Create maps for quick lookup
    const storeMap = new Map(stores.map((s) => [s._id.toString(), s]));
    const categoryMap = new Map(categories.map((c) => [c._id.toString(), c]));

    // Map products to include relations
    const products = productDocs
      .map((product) => {
        const storeIdStr = product.storeId.toString();
        const categoryIdStr = product.category?.id?.toString() || "";
        const store = storeMap.get(storeIdStr);
        const category = categoryMap.get(categoryIdStr);

        if (!store || !category) {
          return null;
        }

        return {
          id: product._id.toString(),
          title: product.title,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice,
          images: product.images || [],
          stock: product.stock,
          tags: product.tags || [],
          rating: product.rating,
          reviewCount: product.reviewCount,
          slug: product.slug,
          storeId: storeIdStr,
          categoryId: new ObjectId(categoryIdStr), // Convert to ObjectId
          store: {
            id: store._id.toString(),
            name: store.name || "",
            subdomain: store.subdomain || "",
          },
          category: {
            id: category._id.toString(),
            name: category.name || "",
            slug: category.slug || "",
          },
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        } as Product; // Type assertion to ensure we're returning a valid Product
      })
      .filter((p): p is Product => p !== null);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update a product
   */
  static async updateProduct(
    id: string,
    data: Partial<Product>
  ): Promise<Product | null> {
    const products = await getProductsCollection();
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.images) {
      updateData.images = data.images;
    }

    const result = await products.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return null;
    }

    return products.findOne({ _id: new mongoose.Types.ObjectId(id) });
  }

  /**
   * Delete a product (soft delete by archiving)
   */
  static async deleteProduct(id: string, userId: string): Promise<void> {
    const products = await getProductsCollection();
    const product = await products.findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.store.ownerId !== userId) {
      throw new Error("Unauthorized");
    }

    // Soft delete by archiving
    await products.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isArchived: true,
          updatedAt: new Date(),
        },
      }
    );
  }

  /**
   * Check if a product exists in a store
   */
  static async isProductInStore(
    productId: string,
    storeId: string
  ): Promise<boolean> {
    const products = await getProductsCollection();
    const count = await products.countDocuments({
      _id: new ObjectId(productId),
      storeId: storeId,
      isArchived: false,
    });

    return count > 0;
  }

  /**
   * Update product inventory
   */
  static async updateInventory(
    id: string,
    quantity: number,
    userId: string
  ): Promise<Product | null> {
    const products = await getProductsCollection();
    const stores = await getStoresCollection();

    // First, find the product and verify ownership
    const product = await products.findOne(
      {
        _id: new ObjectId(id),
      },
      {
        projection: { storeId: 1 },
      }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    // Verify store ownership
    const store = await stores.findOne({
      _id: new ObjectId(product.storeId),
      ownerId: userId,
    });

    if (!store) {
      throw new Error("Unauthorized");
    }

    // Update the inventory using $inc operator
    const result = await products.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $inc: { inventory: quantity },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );

    return result;
  }
}
