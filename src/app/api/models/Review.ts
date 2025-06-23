import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./User";
import { IProduct } from "./Product";

export interface IReview extends Document {
  product: IProduct["_id"];
  user: IUser["_id"];
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index to ensure one review per user per product

const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
