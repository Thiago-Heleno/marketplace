"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription, // Removed unused import
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { submitReview, SubmitReviewSchema } from "@/actions/review.actions"; // Import action and schema
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { useSession } from "next-auth/react";

type ReviewFormValues = z.infer<typeof SubmitReviewSchema>;

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { status } = useSession(); // Removed unused 'session'
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(SubmitReviewSchema),
    defaultValues: {
      productId: productId,
      rating: 0,
      comment: "",
    },
  });

  // Update form rating value when star rating changes
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    form.setValue("rating", newRating, { shouldValidate: true });
  };

  async function onSubmit(data: ReviewFormValues) {
    setIsLoading(true);
    // Ensure rating is set before submitting
    if (data.rating === 0) {
      toast.error("Please select a rating.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await submitReview(data);
      if (result.success) {
        toast.success(result.message || "Review submitted successfully!");
        form.reset({ productId: productId, rating: 0, comment: "" }); // Reset form
        setRating(0); // Reset visual rating
      } else {
        toast.error(result.error || "Failed to submit review.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Submit review error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (status === "unauthenticated") {
    return (
      <p className="text-sm text-muted-foreground">
        Please log in to leave a review.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={(
            { field } // Ensure comment is exactly here
          ) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const currentRating = index + 1;
                    return (
                      <Star
                        key={index}
                        className={`h-6 w-6 cursor-pointer ${
                          currentRating <= (hoverRating || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground"
                        }`}
                        onMouseEnter={() => setHoverRating(currentRating)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRatingChange(currentRating)}
                      />
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about the product..."
                  {...field}
                  rows={4}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || rating === 0}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Review
        </Button>
      </form>
    </Form>
  );
}
