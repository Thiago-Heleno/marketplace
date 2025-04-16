"use client";

import React, { useState, useTransition } from "react";
import { addresses as AddressSchema } from "@/db/schema"; // Import schema type
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card"; // Removed unused CardHeader, CardTitle
import { Badge } from "@/components/ui/badge"; // Added Badge import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogClose, // Removed unused DialogClose
} from "@/components/ui/dialog";
import { AddressForm } from "./AddressForm";
import { deleteAddress, setDefaultAddress } from "@/actions/user.actions";
import { toast } from "sonner";
import { Loader2, Trash2, Edit, Star, Home } from "lucide-react"; // Import icons

type Address = typeof AddressSchema.$inferSelect;

interface AddressListProps {
  addresses: Address[];
}

export function AddressList({ addresses }: AddressListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store ID of address being deleted
  const [isSettingDefault, setIsSettingDefault] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [, startTransition] = useTransition(); // Prefix unused variable

  const handleDelete = (addressId: string) => {
    startTransition(async () => {
      setIsDeleting(addressId);
      const result = await deleteAddress(addressId);
      if (result.success) {
        toast.success(result.message || "Address deleted.");
      } else {
        toast.error(result.error || "Failed to delete address.");
      }
      setIsDeleting(null);
    });
  };

  const handleSetDefault = (addressId: string) => {
    startTransition(async () => {
      setIsSettingDefault(addressId);
      const result = await setDefaultAddress(addressId);
      if (result.success) {
        toast.success(result.message || "Default address updated.");
      } else {
        toast.error(result.error || "Failed to set default address.");
      }
      setIsSettingDefault(null);
    });
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAddress(null); // Clear editing state when closing
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-new-address-button">
              Add New Address
            </Button>{" "}
            {/* Added data-testid */}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm onSuccess={closeAddModal} />
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <p
          className="text-center text-muted-foreground py-4"
          data-testid="address-list-empty-message" // Added data-testid
        >
          You have no saved addresses.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className="flex flex-col"
              data-testid={`address-card-${address.id}`} // Added data-testid
            >
              <CardContent className="pt-6 flex-grow">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4 border-t">
                <div>
                  {address.isDefault ? (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1 inline-block" /> Default
                    </Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isSettingDefault === address.id}
                      data-testid={`address-set-default-button-${address.id}`} // Added data-testid
                    >
                      {isSettingDefault === address.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Home className="h-4 w-4 mr-1" />
                      )}
                      Set as Default
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Dialog
                    open={isEditModalOpen && editingAddress?.id === address.id}
                    onOpenChange={(open) => !open && closeEditModal()}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(address)}
                        data-testid={`address-edit-button-${address.id}`} // Added data-testid
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Address</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                      </DialogHeader>
                      <AddressForm
                        addressId={address.id}
                        initialData={address}
                        onSuccess={closeEditModal}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                    disabled={isDeleting === address.id || !!address.isDefault} // Ensure boolean for disabled prop
                    title={
                      address.isDefault
                        ? "Cannot delete default address"
                        : "Delete Address"
                    }
                    data-testid={`address-delete-button-${address.id}`} // Added data-testid
                  >
                    {isDeleting === address.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">Delete Address</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
