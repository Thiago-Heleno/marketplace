import React from "react";
import Link from "next/link";
import {
  getCustomerOrders /*, type CustomerOrder */,
} from "@/actions/order.actions"; // Removed unused type import
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Download } from "lucide-react"; // For download button

// Helper to format date nicely (consider moving to utils if used elsewhere)
const formatDate = (date: Date | null | undefined): string => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

// Helper to make status more readable (consider moving to utils)
const formatStatus = (status: string): string => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
};

export default async function CustomerOrdersPage() {
  const orders = await getCustomerOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.id.substring(0, 8)}...
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed on: {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge variant="outline">{order.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <Link
                        href={`/products/${item.product?.slug || "#"}`}
                        className="font-medium hover:underline"
                      >
                        {item.product?.title || "Product not found"}
                      </Link>
                      {item.productVariant && (
                        <p className="text-xs text-muted-foreground">
                          {item.productVariant.name}:{" "}
                          {item.productVariant.value}
                        </p>
                      )}
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(item.priceAtPurchaseInCents)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatStatus(item.status)}
                      </p>
                      {/* Download Link for Digital Products */}
                      {item.product?.isDigital &&
                        item.status === "ACCESS_GRANTED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="mt-1"
                          >
                            {/* Use the actual asset ID from the fetched data */}
                            <Link
                              href={`/api/download/${item.product.digitalAssets?.[0]?.id}`}
                              // Disable link if asset ID is somehow missing
                              aria-disabled={
                                !item.product.digitalAssets?.[0]?.id
                              }
                              className={
                                !item.product.digitalAssets?.[0]?.id
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            >
                              <Download className="mr-2 h-4 w-4" /> Download
                            </Link>
                          </Button>
                        )}
                    </div>
                  </div>
                ))}
                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="pt-2 text-sm text-muted-foreground">
                    <h4 className="font-medium text-foreground mb-1">
                      Shipping Address
                    </h4>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end font-semibold">
                Total: {formatPrice(order.totalAmountInCents)}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
