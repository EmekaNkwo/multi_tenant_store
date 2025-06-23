import { StarRating } from "./StarRating";

export function ReviewList({ reviews }: { reviews: any[] }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
          <div className="flex items-start">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <div className="ml-4">
              <div className="flex items-center">
                <h4 className="font-medium">{review.user.name}</h4>
                <span className="mx-2 text-gray-400">•</span>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-3 text-gray-700">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
