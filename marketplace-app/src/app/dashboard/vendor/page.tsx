import { getVendorBalance, getUserProfile } from "@/actions/user.actions"; // Added getUserProfile
import { auth } from "../../../../auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { WithdrawalRequestForm } from "@/components/vendor/WithdrawalRequestForm"; // Import the form

export default async function VendorDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "VENDOR") {
    // Redirect if not a vendor (or handle appropriately)
    redirect("/login");
  }

  // Fetch balance and profile data in parallel
  const [balanceData, userProfile] = await Promise.all([
    getVendorBalance(),
    getUserProfile(), // Fetch profile to check PIX key
  ]);

  // Handle case where balance data might be null/error
  if (!balanceData || !userProfile) {
    return <div>Error loading balance information.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Vendor Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            {/* Optional Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.availableBalance}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Balance
            </CardTitle>
            {/* Optional Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.pendingBalance}
            </div>
            <p className="text-xs text-muted-foreground">
              From orders awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Withdrawals
            </CardTitle>
            {/* Optional Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.pendingWithdrawals}
            </div>
            <p className="text-xs text-muted-foreground">
              Requested but not yet paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Net Earnings
            </CardTitle>
            {/* Optional Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.totalEarnings}
            </div>
            <p className="text-xs text-muted-foreground">
              From all completed orders (after commission)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Request Form */}
      <div className="mt-6">
        <WithdrawalRequestForm
          availableBalanceInCents={balanceData.availableBalance}
          pixKeySet={!!userProfile.pixKey} // Pass whether PIX key is set
        />
      </div>
    </div>
  );
}
