import { getWithdrawalRequests } from "@/actions/user.actions";
// import { formatPrice } from "@/lib/utils"; // No longer needed here
// import { Badge } from "@/components/ui/badge"; // No longer needed here
import { WithdrawalManagementTable } from "@/components/admin/WithdrawalManagementTable"; // Import the table component

// Helper function to format date nicely (optional) - Moved to table component
/*
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
*/

export default async function AdminWithdrawalsPage() {
  // Fetch all requests initially, could add status filter later
  const requests = await getWithdrawalRequests();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Withdrawals</h1>

      {requests.length === 0 ? (
        <p>No withdrawal requests found.</p> // Keep this for empty state
      ) : (
        // Render the table component instead of the list
        <WithdrawalManagementTable requests={requests} />
      )}
      {/* Task 5.1.6 is now complete with the table component */}
    </div>
  );
}
