"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createAddress, updateAddress } from "@/actions/user.actions"; // Import actions
import { Loader2 } from "lucide-react";
import { addresses } from "@/db/schema"; // Import schema type for initialData

// Schema for the form
const AddressFormSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type AddressFormValues = z.infer<typeof AddressFormSchema>;

interface AddressFormProps {
  addressId?: string; // Provided if editing
  initialData?: typeof addresses.$inferSelect | null; // Match DB type
  onSuccess?: () => void; // Callback on successful save
}

export function AddressForm({
  addressId,
  initialData,
  onSuccess,
}: AddressFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!addressId;

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      street: initialData?.street || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      postalCode: initialData?.postalCode || "",
      country: initialData?.country || "",
    },
  });

  const onSubmit = (values: AddressFormValues) => {
    startTransition(async () => {
      let result;
      if (isEditing && addressId) {
        // Ensure addressId exists when editing
        result = await updateAddress(addressId, values);
      } else {
        result = await createAddress(values);
      }

      if (result.success) {
        toast.success(
          result.message ||
            `Address ${isEditing ? "updated" : "added"} successfully!`
        );
        form.reset(); // Reset form on success
        onSuccess?.(); // Call success callback if provided
      } else {
        toast.error(
          result.error || `Failed to ${isEditing ? "update" : "add"} address.`
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Street */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Anytown" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State / Province</FormLabel>
              <FormControl>
                <Input placeholder="CA" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Postal Code */}
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="90210" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="USA" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isPending
            ? "Saving..."
            : isEditing
              ? "Update Address"
              : "Add Address"}
        </Button>
      </form>
    </Form>
  );
}
