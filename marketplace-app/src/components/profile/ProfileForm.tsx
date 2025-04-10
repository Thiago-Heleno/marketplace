"use client";

import React, { useTransition } from "react"; // Removed useState
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Removed unused Label
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/user.actions"; // Import the action
import { Loader2 } from "lucide-react";

// Schema for the form (subset of the action schema, only editable fields)
const ProfileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  pixKey: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

interface ProfileFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    pixKey?: string | null; // Match DB type
    role: string; // Needed to conditionally show PIX key
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const showPixKeyField =
    initialData.role === "VENDOR" || initialData.role === "AFFILIATE";

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      pixKey: initialData.pixKey || "",
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    startTransition(async () => {
      // Only include pixKey if the field should be shown
      const dataToSend = showPixKeyField
        ? values
        : { firstName: values.firstName, lastName: values.lastName };
      const result = await updateUserProfile(dataToSend);
      if (result.success) {
        toast.success(result.message || "Profile updated successfully!");
        // Optionally reset form or handle success state
      } else {
        toast.error(result.error || "Failed to update profile.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {showPixKeyField && (
          <FormField
            control={form.control}
            name="pixKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIX Key (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your PIX key (e.g., email, CPF, phone)"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
