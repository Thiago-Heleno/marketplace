import React from "react";
import { getPendingUsers } from "@/actions/user.actions"; // Import action
import { ApprovalList } from "@/components/admin/ApprovalList"; // Import component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminApprovalsPage() {
  // Fetch pending users
  const pendingUsers = await getPendingUsers();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Approvals (Admin)</h1>
      <p className="text-muted-foreground mb-6">
        Approve or reject pending Vendor and Affiliate registrations.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovalList users={pendingUsers} />
        </CardContent>
      </Card>
    </div>
  );
}
