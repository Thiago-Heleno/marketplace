"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { requestWithdrawal } from "@/actions/user.actions";
import { toast } from "sonner";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Schema for form validation (client-side) - amount in dollars
const FormSchema = z.object({
  amountDollars: z.coerce // Coerce string input to number
    .number({ invalid_type_error: "Please enter a valid amount." })
    .positive("Withdrawal amount must be positive.")
    .multipleOf(0.01, {
      message: "Amount must have up to two decimal places.",
    }), // Ensure cents
});

type FormValues = z.infer<typeof FormSchema>;

interface WithdrawalRequestFormProps {
  availableBalanceInCents: number;
  pixKeySet: boolean;
}

export function WithdrawalRequestForm({
  availableBalanceInCents,
  pixKeySet,
}: WithdrawalRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amountDollars: undefined, // Start with empty or placeholder
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const amountInCents = Math.round(data.amountDollars * 100); // Convert dollars to cents

    // Client-side check before calling server action
    if (!pixKeySet) {
      toast.error("Please set your PIX key in your profile first.");
      setIsSubmitting(false);
      return;
    }
    if (amountInCents <= 0) {
      toast.error("Withdrawal amount must be positive.");
      setIsSubmitting(false);
      return;
    }
    if (amountInCents > availableBalanceInCents) {
      toast.error("Withdrawal amount exceeds available balance.");
      setIsSubmitting(false);
      return;
    }

    const result = await requestWithdrawal({ amount: amountInCents });

    if (result.success) {
      toast.success(result.message || "Withdrawal request submitted!");
      form.reset(); // Reset form on success
    } else {
      toast.error(result.error || "Failed to submit withdrawal request.");
    }
    setIsSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Withdrawal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Available Balance:{" "}
                <span className="font-medium">
                  {formatPrice(availableBalanceInCents)}
                </span>
              </p>
              {!pixKeySet && (
                <p className="text-sm text-red-600">
                  Warning: PIX Key not set in profile. You cannot request a
                  withdrawal.
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="amountDollars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01" // Allow cents
                      placeholder="e.g., 50.00"
                      {...field}
                      disabled={isSubmitting || !pixKeySet}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the amount you wish to withdraw.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                isSubmitting || !pixKeySet || availableBalanceInCents <= 0
              }
            >
              {isSubmitting ? "Submitting..." : "Request Withdrawal"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
