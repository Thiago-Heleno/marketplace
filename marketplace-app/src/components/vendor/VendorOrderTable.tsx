"use client";

import React, { useTransition } from "react"; // Removed useState
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Corrected import path
import { formatPrice } from "@/lib/utils";
import {
  VendorOrderItem,
  updateOrderItemStatus,
} from "@/actions/order.actions";
import { ArrowRight, MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { orderItemStatusEnum } from "@/db/schema";

interface VendorOrderTableProps {
  orderItems: VendorOrderItem[];
}

// Helper to format date nicely
const formatDate = (date: Date | null | undefined): string => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

// Helper to make status more readable
const formatStatus = (status: string): string => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
};

// Define allowed status transitions for UI logic
const allowedVendorTransitionsUI: Record<string, string[]> = {
  PENDING_FULFILLMENT: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
};

// Define the type for the status enum values used in the component
type OrderItemStatus = (typeof orderItemStatusEnum.enumValues)[number];

// Row Actions Component
function OrderItemActions({ item }: { item: VendorOrderItem }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (newStatus: OrderItemStatus) => {
    startTransition(async () => {
      const result = await updateOrderItemStatus(item.id, newStatus);
      if (result.success) {
        toast.success(result.message || "Status updated successfully.");
      } else {
        toast.error(result.error || "Failed to update status.");
      }
    });
  };

  // Determine possible next statuses based on current status and product type
  const possibleNextStatuses =
    (item.product?.isPhysical && allowedVendorTransitionsUI[item.status]) || [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={isPending}
          data-testid={`order-item-actions-trigger-${item.id}`} // Added data-testid
        >
          <span className="sr-only">Open menu</span>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {possibleNextStatuses.length > 0 ? (
          possibleNextStatuses.map(
            (
              status: string // Added explicit type for status
            ) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusUpdate(status as OrderItemStatus)}
                disabled={isPending}
                // Add dynamic test id based on the action
                data-testid={`order-item-${status.toLowerCase()}-${item.id}`}
              >
                Mark as {formatStatus(status)}
              </DropdownMenuItem>
            )
          )
        ) : (
          <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function VendorOrderTable({ orderItems }: VendorOrderTableProps) {
  if (!orderItems || orderItems.length === 0) {
    return (
      <p
        className="text-center text-muted-foreground py-4"
        data-testid="vendor-orders-empty-message" // Added data-testid
      >
        You have no order items yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Variant</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderItems.map((item) => (
          <TableRow key={item.id} data-testid={`order-item-row-${item.id}`}>
            {" "}
            {/* Added data-testid */}
            <TableCell className="font-medium truncate" title={item.orderId}>
              {item.order.id.substring(0, 8)}... {/* Shorten Order ID */}
            </TableCell>
            <TableCell>{formatDate(item.order.createdAt)}</TableCell>
            <TableCell>
              <Link
                href={`/products/${item.product?.slug || "#"}`}
                className="hover:underline flex items-center gap-1"
                target="_blank"
              >
                {item.product?.title || "N/A"}{" "}
                <ArrowRight className="h-3 w-3 inline-block" />
              </Link>
            </TableCell>
            <TableCell>
              {item.productVariant?.name && item.productVariant?.value
                ? `${item.productVariant.name}: ${item.productVariant.value}`
                : "N/A"}
            </TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">
              {formatPrice(item.priceAtPurchaseInCents)}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  item.status === "DELIVERED" ||
                  item.status === "ACCESS_GRANTED"
                    ? "default"
                    : "secondary"
                }
                data-testid={`order-item-status-badge-${item.id}`} // Added data-testid
              >
                {formatStatus(item.status)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <OrderItemActions item={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
