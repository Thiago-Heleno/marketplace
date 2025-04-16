"use client";

import { useState } from "react";
import {
  approveWithdrawal,
  rejectWithdrawal,
  markWithdrawalPaid,
} from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the type for a single request, mirroring the data structure from getWithdrawalRequests
type WithdrawalRequest = {
  id: string;
  amountInCents: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  pixKeyUsed: string;
  requestedAt: Date;
  processedAt: Date | null;
  adminNotes: string | null;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
};

interface WithdrawalManagementTableProps {
  requests: WithdrawalRequest[];
}

// Helper function to format date nicely (copied from page)
function formatDate(date: Date | null | undefined): string {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function WithdrawalManagementTable({
  requests,
}: WithdrawalManagementTableProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(
    null
  );

  const handleAction = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (id: string, ...args: any[]) => Promise<any>,
    requestId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => {
    setIsLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      const result = await action(requestId, ...args);
      if (result.success) {
        toast.success(result.message || "Action successful!");
        // Revalidation happens via server action, data should refresh on next load/navigation
      } else {
        toast.error(result.error || "Action failed.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Withdrawal action error:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [requestId]: false }));
      setRejectingRequestId(null); // Close dialog if open
      setRejectionReason(""); // Clear reason
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectingRequestId) return;
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason cannot be empty.");
      return;
    }
    handleAction(rejectWithdrawal, rejectingRequestId, {
      adminNotes: rejectionReason,
    });
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>PIX Key</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Processed At</TableHead>
            <TableHead>Admin Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center"
                data-testid="admin-withdrawals-empty-message" // Added data-testid
              >
                No withdrawal requests found.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow key={req.id} data-testid={`withdrawal-row-${req.id}`}>
                {" "}
                {/* Added data-testid */}
                <TableCell data-testid={`withdrawal-email-cell-${req.id}`}>
                  {" "}
                  {/* Added data-testid */}
                  <div className="font-medium">
                    {req.user?.firstName} {req.user?.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {req.user?.email}
                  </div>
                </TableCell>
                <TableCell data-testid={`withdrawal-amount-cell-${req.id}`}>
                  {" "}
                  {/* Added data-testid */}
                  {formatPrice(req.amountInCents)}
                </TableCell>
                <TableCell>{req.pixKeyUsed}</TableCell>
                <TableCell>{formatDate(req.requestedAt)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      req.status === "PENDING"
                        ? "secondary"
                        : req.status === "APPROVED"
                          ? "default"
                          : req.status === "PAID"
                            ? "outline"
                            : "destructive"
                    }
                    data-testid={`withdrawal-status-cell-${req.id}`} // Added data-testid
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(req.processedAt)}</TableCell>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={req.adminNotes ?? ""}
                >
                  {req.adminNotes || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {req.status === "PENDING" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAction(approveWithdrawal, req.id)
                          }
                          disabled={isLoading[req.id]}
                          data-testid={`withdrawal-approve-button-${req.id}`} // Added data-testid
                        >
                          {isLoading[req.id] ? "Approving..." : "Approve"}
                        </Button>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setRejectingRequestId(req.id)}
                            disabled={isLoading[req.id]}
                            data-testid={`withdrawal-reject-button-${req.id}`} // Added data-testid
                          >
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                      </>
                    )}
                    {req.status === "APPROVED" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            handleAction(markWithdrawalPaid, req.id)
                          }
                          disabled={isLoading[req.id]}
                          data-testid={`withdrawal-mark-paid-button-${req.id}`} // Added data-testid
                        >
                          {isLoading[req.id] ? "Marking..." : "Mark Paid"}
                        </Button>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setRejectingRequestId(req.id)}
                            disabled={isLoading[req.id]}
                            data-testid={`withdrawal-reject-button-${req.id}`} // Added data-testid (Duplicate ID, but context differs)
                          >
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                      </>
                    )}
                    {/* No actions needed for PAID or REJECTED */}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Rejection Dialog */}
      <AlertDialog
        open={!!rejectingRequestId}
        onOpenChange={(open: boolean) => !open && setRejectingRequestId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Withdrawal Request?</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this withdrawal request.
              This note will be stored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rejection-reason" className="text-right">
                Reason
              </Label>
              <Input
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Insufficient completed orders"
                data-testid="withdrawal-reject-dialog-reason-input" // Added data-testid
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectSubmit}
              disabled={
                !rejectionReason.trim() || isLoading[rejectingRequestId || ""]
              }
              data-testid="withdrawal-reject-dialog-confirm-button" // Added data-testid
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
