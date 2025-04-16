"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../ui/button"; // Adjusted path
import { CartSheet } from "../cart/CartSheet"; // Adjusted path
import { LogOut, LayoutDashboard, ShoppingBag, HomeIcon } from "lucide-react"; // Import icons

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); // Redirect to home after sign out
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6" />
          <span className="font-bold">Marketplace</span>
        </Link>

        {/* Navigation Links - Centered */}
        <nav className="hidden flex-grow items-center justify-center space-x-6 text-sm font-medium md:flex">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center" // Added flex items-center
            data-testid="navbar-home-link" // Added data-testid
          >
            <HomeIcon className="h-5 w-5 mr-1 inline-block" /> Home
          </Link>
          <Link
            href="/products"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            data-testid="navbar-products-link" // Added data-testid
          >
            Products
          </Link>
          {/* Add other links like Categories later if needed */}
        </nav>

        {/* Right Side Actions - Pushed to the right */}
        <div className="flex items-center justify-end space-x-2 md:space-x-4">
          {" "}
          {/* Adjusted spacing */}
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted"></div> // Skeleton loader
          ) : session?.user ? (
            <>
              <Link href="/dashboard" data-testid="navbar-dashboard-link">
                {" "}
                {/* Added data-testid */}
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                data-testid="navbar-logout-button" // Added data-testid
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="navbar-login-button" // Added data-testid
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" data-testid="navbar-register-button">
                  {" "}
                  {/* Added data-testid */}
                  Register
                </Button>
              </Link>
            </>
          )}
          <CartSheet /> {/* Cart button is inside CartSheet */}
        </div>
      </div>
    </header>
  );
}
