"use client";

import { useState, useTransition } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form"; // Import ControllerRenderProps
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // Import sonner toast
import { registerUser } from "@/actions/auth.actions";
import { RegisterSchema } from "@/lib/schemas/auth.schema";
import { userRoleEnum } from "@/db/schema"; // Import enum for roles

// Define the extended schema type including role for the form
type RegisterFormInput = z.infer<typeof RegisterSchema> & {
  role: (typeof userRoleEnum.enumValues)[number];
};

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(
      RegisterSchema.extend({ role: z.enum(userRoleEnum.enumValues) })
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: userRoleEnum.enumValues[0], // Default to CUSTOMER
    },
  });

  const onSubmit = (values: RegisterFormInput) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await registerUser(values);
      if (result.success) {
        setSuccess(result.message);
        toast.success("Registration Successful", {
          description: result.message,
        }); // Corrected call
        form.reset(); // Reset form on success
      } else {
        setError(result.message);
        toast.error("Registration Failed", { description: result.message }); // Corrected call
        // Note: Sonner doesn't have variants like Shadcn toast, styling is different.
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<RegisterFormInput, "firstName">;
                }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        disabled={isPending}
                        data-testid="register-firstname-input" // Added data-testid
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<RegisterFormInput, "lastName">;
                }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        disabled={isPending}
                        data-testid="register-lastname-input" // Added data-testid
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({
                field,
              }: {
                field: ControllerRenderProps<RegisterFormInput, "email">;
              }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      disabled={isPending}
                      data-testid="register-email-input" // Added data-testid
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
                field: ControllerRenderProps<RegisterFormInput, "password">;
              }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={isPending}
                      data-testid="register-password-input" // Added data-testid
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({
                field,
              }: {
                field: ControllerRenderProps<RegisterFormInput, "role">;
              }) => (
                <FormItem>
                  <FormLabel>Register as</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="register-role-select">
                        {" "}
                        {/* Added data-testid */}
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Filter out ADMIN role from registration options */}
                      {userRoleEnum.enumValues
                        .filter((role) => role !== "ADMIN")
                        .map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0) + role.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Success/Error Messages */}
            {success && (
              <div
                className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700"
                data-testid="register-success-message" // Added data-testid
              >
                {success}
              </div>
            )}
            {error && (
              <div
                className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700"
                data-testid="register-error-message" // Added data-testid
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              data-testid="register-submit-button" // Added data-testid
            >
              {isPending ? "Registering..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline hover:text-primary">
                Login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
