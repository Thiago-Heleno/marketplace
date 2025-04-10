import type { DefaultSession, User as DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";
import type { UserRole, UserStatus } from "./src/db/schema"; // Import your enums

// Extend the default User type
interface ExtendedUser extends DefaultUser {
  role: UserRole;
  status: UserStatus;
  // Add any other custom fields you might add to the user object in JWT/Session
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: ExtendedUser & DefaultSession["user"]; // Combine ExtendedUser with default fields like name, email, image
  }

  // The User type used in callbacks now implicitly includes fields from ExtendedUser
  // due to the Session interface modification. No need for explicit extension here
  // unless you override specific callback signatures needing the full User type.
  // interface User extends ExtendedUser {} // Removed redundant interface
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    idToken?: string;
    role: UserRole;
    status: UserStatus;
    // Add other token fields as needed
  }
}
