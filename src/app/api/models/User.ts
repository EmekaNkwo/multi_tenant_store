import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  sessionId?: string;
  role: "admin" | "merchant" | "customer";
  stripeCustomerId?: string;
  stripeAccountId?: string;
  store?: Schema.Types.ObjectId; // Reference to Store if user is a merchant
  addresses?: {
    type: "billing" | "shipping";
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
      trim: true,
      lowercase: true,
    },
    emailVerified: {
      type: Date,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      select: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    sessionId: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "merchant", "customer"],
      default: "customer",
    },
    stripeCustomerId: {
      type: String,
    },
    stripeAccountId: {
      type: String,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ["billing", "shipping"],
          required: true,
        },
        street: {
          type: String,
          required: [true, "Please add a street address"],
        },
        city: {
          type: String,
          required: [true, "Please add a city"],
        },
        state: {
          type: String,
          required: [true, "Please add a state"],
        },
        postalCode: {
          type: String,
          required: [true, "Please add a postal code"],
        },
        country: {
          type: String,
          required: [true, "Please add a country"],
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    phone: {
      type: String,
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        "Please add a valid phone number",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ store: 1 });
UserSchema.index({ "addresses.type": 1 });
UserSchema.index({ "addresses.isDefault": 1 });

// Virtual for getting the user's full address
UserSchema.virtual("fullAddress").get(function () {
  const defaultAddress = this.addresses?.find((addr) => addr.isDefault);
  if (defaultAddress) {
    return `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.postalCode}, ${defaultAddress.country}`;
  }
  return "No default address set";
});

// Virtual for checking if user is a merchant
UserSchema.virtual("isMerchant").get(function () {
  return this.role === "merchant";
});

// Virtual for checking if user is an admin
UserSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});

// Export the model
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
