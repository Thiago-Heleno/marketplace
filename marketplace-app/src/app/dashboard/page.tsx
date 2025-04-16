import { redirect } from "next/navigation";
import { auth } from "../../../auth"; // Corrected relative path

/**
 * Root page for the /dashboard route.
 * Checks user role and redirects to the appropriate specific dashboard section.
 */
export default async function DashboardRootPage() {
  const session = await auth();

  // If no session (should be caught by middleware, but good to double-check)
  if (!session?.user) {
    redirect("/login");
  }

  // Redirect based on user role
  const userRole = session.user.role;

  switch (userRole) {
    case "VENDOR":
      redirect("/dashboard/vendor");
      break; // Technically unreachable after redirect, but good practice
    case "AFFILIATE":
      redirect("/dashboard/affiliate");
      break;
    case "ADMIN":
      // Redirect admin to a default admin page (e.g., approvals)
      redirect("/dashboard/admin/approvals");
      break;
    case "CUSTOMER":
    default:
      // Redirect customers and any unexpected roles to their profile page
      redirect("/dashboard/profile");
      break;
  }

  // This part should ideally not be reached due to redirects,
  // but returning null satisfies the component return type.
  return null;
}
