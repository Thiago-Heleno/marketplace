"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { approveUser, rejectUser } from "@/actions/user.actions"; // Import actions
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

// Define the expected shape of a pending user based on getPendingUsers action
type PendingUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: Date;
};

interface ApprovalListProps {
  users: PendingUser[];
}

function UserApprovalActions({ userId }: { userId: string }) {
  const [isApproving, startApproveTransition] = useTransition();
  const [isRejecting, startRejectTransition] = useTransition();

  const handleApprove = () => {
    startApproveTransition(async () => {
      const result = await approveUser(userId);
      if (result.success) {
        toast.success(result.message || "User approved.");
      } else {
        toast.error(result.error || "Failed to approve user.");
      }
    });
  };

  const handleReject = () => {
    startRejectTransition(async () => {
      const result = await rejectUser(userId);
      if (result.success) {
        toast.success(result.message || "User rejected.");
      } else {
        toast.error(result.error || "Failed to reject user.");
      }
    });
  };

  const isPending = isApproving || isRejecting;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleApprove}
        disabled={isPending}
        className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
      >
        {isApproving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        <span className="ml-1">Approve</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleReject}
        disabled={isPending}
      >
        {isRejecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        <span className="ml-1">Reject</span>
      </Button>
    </div>
  );
}

export function ApprovalList({ users }: ApprovalListProps) {
  // Helper to format date nicely
  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  if (!users || users.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No users awaiting approval.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {user.firstName} {user.lastName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <Badge variant="secondary">{user.role}</Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Registered: {formatDate(user.createdAt)}
              </p>
            </div>
            <UserApprovalActions userId={user.id} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
