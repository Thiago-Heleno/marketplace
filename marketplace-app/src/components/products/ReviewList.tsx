import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Removed AvatarImage
import { Star } from "lucide-react";

// Define the structure of a review, including user details
type ReviewWithUser = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    firstName: string | null;
    lastName: string | null;
    // Add image field if you store user avatars
  } | null;
};

interface ReviewListProps {
  reviews: ReviewWithUser[];
}

// Helper function to format date nicely
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Helper to get initials for Avatar fallback
const getInitials = (
  firstName?: string | null,
  lastName?: string | null
): string => {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase() || "U"; // Default to 'U' for User
};

export function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-4">
          <Avatar className="h-10 w-10">
            {/* Placeholder for user image - replace with actual image if available */}
            {/* <AvatarImage src={review.user?.imageUrl} alt={`${review.user?.firstName} ${review.user?.lastName}`} /> */}
            <AvatarFallback>
              {getInitials(review.user?.firstName, review.user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {review.user?.firstName || "User"} {review.user?.lastName || ""}
              </p>
              <span className="text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            {review.comment && (
              <p className="mt-2 text-sm text-muted-foreground">
                {review.comment}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
