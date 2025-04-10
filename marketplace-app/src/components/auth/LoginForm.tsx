"use client";

import { useState, useTransition } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import Link from "next/link"; // Import Link component

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
import { signInWithCredentials } from "@/actions/auth.actions";
import { LoginSchema, LoginInput } from "@/lib/schemas/auth.schema";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Initialize router
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginInput) => {
    setError(null);

    startTransition(async () => {
      const result = await signInWithCredentials(values);

      if (result.success) {
        toast.success(result.message);
        // Redirect on success using router.push()
        router.push(result.redirectTo || "/dashboard"); // Default to /dashboard if no redirect path
      } else {
        setError(result.message);
        toast.error("Login Failed", { description: result.message });
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Access your account.</CardDescription>
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
                field: ControllerRenderProps<LoginInput, "email">;
              }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({
                field,
              }: {
                field: ControllerRenderProps<LoginInput, "password">;
              }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="text-right text-sm">
                    <Link
                      href="/forgot-password"
                      className="underline hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Error Message */}
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="underline hover:text-primary">
                Register
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
