import { z } from "zod";

// === Product Input Schema ===
export const productInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  discountPrice: z.number().optional(),
  categoryId: z.string().min(1, "Category ID is required"),
  storeId: z.string().min(1, "Store ID is required"),
  images: z
    .array(z.string().url())
    .min(1, "At least one image URL is required"),
  stock: z.number().int().min(0).default(0),
  inventory: z.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

// === Partial Schema for Updates ===
export const updateProductSchema = productInputSchema.partial();

export type CreateProductInput = z.infer<typeof productInputSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
