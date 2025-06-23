import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IStore } from "./Store";
import { IProduct } from "./Product";

export interface IOrderItem {
  productId: IProduct["_id"];
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface IOrder extends Document {
  user: IUser["_id"];
  store: IStore["_id"];
  items: IOrderItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentIntentId: string;
  transferId?: string;
  payoutStatus?: "pending" | "completed" | "failed";
  customerName: string;
  customerEmail: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    paymentIntentId: { type: String, required: true },
    transferId: { type: String },
    payoutStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
