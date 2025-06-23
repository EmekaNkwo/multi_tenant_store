"use server";

import { connectDB } from "@/lib/db";
import Product from "@/app/api/models/Product";
import Review from "@/app/api/models/Review";

export async function createReview(reviewData: {
  productId: string;
  rating: number;
  comment: string;
  userId: string;
}) {
  await connectDB();

  const newReview = new Review({
    product: reviewData.productId,
    user: reviewData.userId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  });

  await newReview.save();

  // Update product rating
  const reviews = await Review.find({ product: reviewData.productId });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Product.findByIdAndUpdate(reviewData.productId, {
    rating: averageRating,
    reviewCount: reviews.length,
  });

  return newReview;
}
