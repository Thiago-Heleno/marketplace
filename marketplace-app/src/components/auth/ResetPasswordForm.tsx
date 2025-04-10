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
import { resetPassword } from "@/actions/auth.actions";
import {
  ResetPasswordSchema,
  ResetPasswordInput,
} from "@/lib/schemas/auth.schema";

interface ResetPasswordFormProps {
  token: string | null; // Receive token as a prop
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: token || "", // Initialize token from prop
      password: "",
      confirmPassword: "",
    },
  });

  // Show error immediately if token is missing
  useState(() => {
    if (!token) {
      setError("Password reset token is missing or invalid.");
      toast.error("Invalid Link", {
        description: "Password reset token is missing or invalid.",
      });
    }
  });

  const onSubmit = (values: ResetPasswordInput) => {
    setError(null);
    setSuccess(null);

    // Ensure token is present before submitting
    if (!values.token) {
      setError("Password reset token is missing or invalid.");
      toast.error("Invalid Link", {
        description: "Password reset token is missing or invalid.",
      });
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(values);

      if (result.success) {
        setSuccess(result.message);
        toast.success("Password Reset Successful", {
          description: result.message,
        });
        form.reset(); // Reset form on success
        // Optionally redirect to login after a delay
      } else {
        setError(result.message);
        toast.error("Password Reset Failed", { description: result.message });
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden input for the token (already in form state) */}
            {/* <input type="hidden" {...form.register("token")} /> */}

            <FormField
              control={form.control}
              name="password"
              render={({
                field,
              }: {
                field: ControllerRenderProps<ResetPasswordInput, "password">;
              }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={isPending || !token || !!success} // Disable if no token or success
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  ResetPasswordInput,
                  "confirmPassword"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={isPending || !token || !!success} // Disable if no token or success
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Success/Error Messages */}
            {success && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">
                {success}
              </div>
            )}
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !token || !!success} // Disable if no token or success
            >
              {isPending ? "Resetting..." : "Reset Password"}
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
