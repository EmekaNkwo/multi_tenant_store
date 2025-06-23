import { ObjectId } from "mongodb";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "merchant" | "customer";
  storeId?: string;
  stripeAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Store {
  _id?: string | ObjectId;
  id?: string;
  subdomain: string;
  name?: string;
  description?: string;
  stripeAccountId?: string;
  ownerId?: string;
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    bannerUrl?: string;
  };
  createdAt?: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  storeId: string;
  title?: string;
  slug?: string;
  description?: string;
  categoryId?: ObjectId;
  price?: number;
  images?: string[]; // Array of image URL
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  stock?: number;
  createdAt?: Date;
  updatedAt: Date;
  store: Store;
  category: Category;
  discountPrice?: number;
}

export interface Category {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentIntentId: string;
  transferId?: string;
  payoutStatus?: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreBranding {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  bannerUrl: string;
}

// Interface for store configuration
export interface StoreConfig extends Omit<Store, "branding"> {
  branding: StoreBranding;
}

// Interface for product filters
export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  categories?: string | string[];
}
