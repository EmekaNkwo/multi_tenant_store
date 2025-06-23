import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { ICategory } from "./Category";

export interface IBranding {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface IStore extends Document {
  subdomain: string;
  name: string;
  description?: string;
  owner: IUser["_id"];
  stripeAccountId?: string;
  branding: IBranding;
  createdAt: Date;
  updatedAt: Date;
  categories: ICategory["_id"][];
  approved: boolean;
  approvedAt: Date | null;
  approvedBy: IUser["_id"] | null;
}

const StoreSchema = new Schema<IStore>(
  {
    subdomain: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stripeAccountId: { type: String },
    branding: {
      primaryColor: { type: String, default: "#2563eb" },
      secondaryColor: { type: String, default: "#7c3aed" },
      logoUrl: { type: String },
      bannerUrl: { type: String },
    },
    approved: {
      type: Boolean,
      default: false,
      required: true,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Store ||
  mongoose.model<IStore>("Store", StoreSchema);
