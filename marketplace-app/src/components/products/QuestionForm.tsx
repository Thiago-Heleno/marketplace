"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { submitQuestion, SubmitQuestionSchema } from "@/actions/review.actions"; // Import action and schema
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

type QuestionFormValues = z.infer<typeof SubmitQuestionSchema>;

interface QuestionFormProps {
  productId: string;
}

export function QuestionForm({ productId }: QuestionFormProps) {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(SubmitQuestionSchema),
    defaultValues: {
      productId: productId,
      question: "",
    },
  });

  async function onSubmit(data: QuestionFormValues) {
    setIsLoading(true);
    try {
      const result = await submitQuestion(data);
      if (result.success) {
        toast.success(result.message || "Question submitted successfully!");
        form.reset(); // Reset form
      } else {
        toast.error(result.error || "Failed to submit question.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Submit question error:", error);
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
        Please log in to ask a question.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ask a Question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your question about the product here..."
                  {...field}
                  rows={3}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Question
        </Button>
      </form>
    </Form>
  );
}
