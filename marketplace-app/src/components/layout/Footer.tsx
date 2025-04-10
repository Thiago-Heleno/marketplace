import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row md:px-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {currentYear} Marketplace Inc. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="/terms"
            className="text-sm hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false} // Optional: set prefetch behavior
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-sm hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Privacy Policy
          </Link>
          <Link
            href="/about"
            className="text-sm hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            About Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}
