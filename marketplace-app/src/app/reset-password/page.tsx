import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react"; // Import Suspense

// Helper component to extract search params
function ResetPasswordPageContent({ token }: { token: string | null }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <ResetPasswordForm token={token} />
    </div>
  );
}

// Page component receives searchParams prop
export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams?.token as string | null;

  return (
    // Use Suspense for client components accessing searchParams
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageContent token={token ?? null} />
    </Suspense>
  );
}
