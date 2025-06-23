import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IProduct } from "./Product";

export interface ICartItem {
  product: IProduct["_id"];
  quantity: number;
}

export interface ICart extends Document {
  user: IUser["_id"];
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Cart ||
  mongoose.model<ICart>("Cart", CartSchema);
