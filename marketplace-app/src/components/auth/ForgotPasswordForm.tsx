"use client";

import { useState, useTransition } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"; // For linking back to login

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { requestPasswordReset } from "@/actions/auth.actions";
import {
  ForgotPasswordSchema,
  ForgotPasswordInput,
} from "@/lib/schemas/auth.schema";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  // Removed unused error state: const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordInput) => {
    // Removed: setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await requestPasswordReset(values);

      // Always show the generic success message to prevent email enumeration
      setSuccess(result.message);
      toast.success("Request Submitted", { description: result.message });

      // Optionally clear form or disable button further if needed
      form.reset(); // Reset form regardless of actual outcome for security
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({
                field,
              }: {
                field: ControllerRenderProps<ForgotPasswordInput, "email">;
              }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      disabled={isPending}
                      data-testid="forgot-password-email-input" // Added data-testid
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Success/Error Messages (only success shown for security) */}
            {success && (
              <div
                className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700"
                data-testid="forgot-password-success-message" // Added data-testid
              >
                {success}
              </div>
            )}
            {/* We don't show specific errors here to prevent enumeration */}
            {/* {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )} */}

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              data-testid="forgot-password-submit-button" // Added data-testid
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/login" className="underline hover:text-primary">
                Back to Login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
