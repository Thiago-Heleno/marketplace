import {
  getAffiliateCode,
  getAffiliateBalance,
} from "@/actions/affiliate.actions"; // Added getAffiliateBalance
import { getUserProfile } from "@/actions/user.actions"; // Added getUserProfile
import { AffiliateCodeDisplay } from "@/components/affiliate/AffiliateCodeDisplay";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added Card components
import { WithdrawalRequestForm } from "@/components/vendor/WithdrawalRequestForm"; // Re-use vendor form

export default async function AffiliateDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "AFFILIATE") {
    // Redirect if not an affiliate (or handle appropriately)
    // Might redirect to profile or a specific 'become affiliate' page later
    redirect("/login");
  }

  // Fetch code, balance, and profile data in parallel
  const [{ code }, balanceData, userProfile] = await Promise.all([
    getAffiliateCode(),
    getAffiliateBalance(),
    getUserProfile(),
  ]);

  // Handle case where data might be null/error
  if (!balanceData || !userProfile) {
    return <div>Error loading affiliate dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Affiliate Dashboard</h1>

      <AffiliateCodeDisplay initialCode={code} />

      {/* Balance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
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
              Pending Commissions
            </CardTitle>
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
              From referrals awaiting confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Withdrawals
            </CardTitle>
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
              From all confirmed referrals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Commission Tracking Table (Task 5.2.3) */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Referral History</h2>
        {/* Referral list table will go here */}
        <p className="text-muted-foreground">Referral history coming soon...</p>
      </div>

      {/* Withdrawal Form */}
      <div className="mt-6">
        <WithdrawalRequestForm
          availableBalanceInCents={balanceData.availableBalance}
          pixKeySet={!!userProfile.pixKey} // Pass whether PIX key is set
        />
      </div>
    </div>
  );
}
