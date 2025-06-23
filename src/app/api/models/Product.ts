import mongoose, { Schema, Document } from "mongoose";
import { IStore } from "./Store";
import { ICategory } from "./Category";

export interface IProduct extends Document {
  store: IStore["_id"];
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: ICategory["_id"];
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  stock: number;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: String }],
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
