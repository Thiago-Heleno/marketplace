import React from "react";
import { getVendorOrderItems } from "@/actions/order.actions";
import { VendorOrderTable } from "@/components/vendor/VendorOrderTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components

export default async function VendorOrdersPage() {
  const orderItems = await getVendorOrderItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Order Items</h1>
      <p className="text-muted-foreground mb-6">
        View and manage items from orders placed for your products.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <VendorOrderTable orderItems={orderItems} />
        </CardContent>
      </Card>
    </div>
  );
}
