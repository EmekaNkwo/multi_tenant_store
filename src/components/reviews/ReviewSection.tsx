"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/reviews/StarRating";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ReviewList } from "./ReviewList";
import { createReview } from "@/actions/reviews";

export default function ReviewSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!session) {
      toast.error("Authentication required");
      return;
    }

    if (rating === 0) {
      toast.error("Rating required");
      return;
    }

    try {
      setLoading(true);
      const newReview = await createReview({
        productId,
        rating,
        comment,
        userId: session.user?.name || "",
      });

      setReviews([newReview, ...reviews]);
      setRating(0);
      setComment("");

      toast.success("Review submitted");
    } catch (error) {
      toast.error("Review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="font-medium mb-4">Leave a Review</h3>
        <div className="space-y-4">
          <div>
            <p>Your Rating</p>
            <StarRating rating={rating} editable={true} onChange={setRating} />
          </div>

          <div>
            <Textarea
              placeholder="Share your experience with this product"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || rating === 0 || comment.trim() === ""}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>

      <ReviewList reviews={reviews} />
    </div>
  );
}
