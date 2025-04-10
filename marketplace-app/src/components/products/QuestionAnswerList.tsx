"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react"; // Use client-side session hook
import { submitAnswer } from "@/actions/review.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Define the structure of Q&A, including user and answerer details
type QuestionAnswerWithDetails = {
  id: string;
  question: string;
  answer: string | null;
  createdAt: Date;
  answeredAt: Date | null;
  user: {
    // User who asked
    firstName: string | null;
    lastName: string | null;
  } | null;
  answeredByUser: {
    // User who answered (Vendor/Admin)
    firstName: string | null;
    lastName: string | null;
  } | null;
  product: {
    // Needed for authorization check
    vendorId: string;
  } | null;
};

interface QuestionAnswerListProps {
  questionAnswers: QuestionAnswerWithDetails[];
  // productId: string; // Removed unused prop
}

// Helper function to format date nicely
function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export function QuestionAnswerList({
  questionAnswers,
}: // productId, // Removed unused prop
QuestionAnswerListProps) {
  const { data: session } = useSession(); // Get session on client
  const [answerForms, setAnswerForms] = useState<
    Record<string, { text: string; isLoading: boolean }>
  >({});

  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswerForms((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], text },
    }));
  };

  const handleAnswerSubmit = async (questionId: string) => {
    const answerText = answerForms[questionId]?.text;
    if (!answerText || !answerText.trim()) {
      toast.error("Answer cannot be empty.");
      return;
    }

    setAnswerForms((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], isLoading: true },
    }));

    try {
      const result = await submitAnswer({
        questionId,
        answer: answerText.trim(),
      });
      if (result.success) {
        toast.success(result.message || "Answer submitted!");
        // Clear form state after successful submission
        setAnswerForms((prev) => {
          const newState = { ...prev };
          delete newState[questionId];
          return newState;
        });
        // Revalidation should happen via server action, but might need client-side update too
      } else {
        toast.error(result.error || "Failed to submit answer.");
        setAnswerForms((prev) => ({
          ...prev,
          [questionId]: { ...prev[questionId], isLoading: false },
        }));
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Submit answer error:", error);
      setAnswerForms((prev) => ({
        ...prev,
        [questionId]: { ...prev[questionId], isLoading: false },
      }));
    }
  };

  // Determine if the current user can answer a specific question
  const canAnswer = (qa: QuestionAnswerWithDetails): boolean => {
    if (!session?.user) return false; // Not logged in
    if (session.user.role === "ADMIN") return true; // Admin can always answer
    if (
      session.user.role === "VENDOR" &&
      qa.product?.vendorId === session.user.id
    )
      return true; // Vendor owns product
    return false;
  };

  if (!questionAnswers || questionAnswers.length === 0) {
    return <p className="text-muted-foreground">No questions asked yet.</p>;
  }

  return (
    <div className="space-y-8">
      {questionAnswers.map((qa) => (
        <div key={qa.id} className="flex gap-4">
          <Avatar className="h-10 w-10 mt-1">
            <AvatarFallback>
              {getInitials(qa.user?.firstName, qa.user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            {/* Question */}
            <div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {qa.user?.firstName || "User"} {qa.user?.lastName || ""}
                </p>
                <span className="text-xs text-muted-foreground">
                  Asked: {formatDate(qa.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm">Q: {qa.question}</p>
            </div>

            {/* Answer */}
            {qa.answer ? (
              <div className="pl-6 border-l-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">
                    A: {qa.answeredByUser?.firstName || "Staff"}{" "}
                    {qa.answeredByUser?.lastName || ""}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Answered: {formatDate(qa.answeredAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {qa.answer}
                </p>
              </div>
            ) : (
              // Show Answer Form if user is authorized and no answer exists
              canAnswer(qa) && (
                <div className="pl-6 space-y-2">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={answerForms[qa.id]?.text || ""}
                    onChange={(e) => handleAnswerChange(qa.id, e.target.value)}
                    disabled={answerForms[qa.id]?.isLoading}
                    rows={2}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAnswerSubmit(qa.id)}
                    disabled={
                      answerForms[qa.id]?.isLoading ||
                      !answerForms[qa.id]?.text?.trim()
                    }
                  >
                    {answerForms[qa.id]?.isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit Answer
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
