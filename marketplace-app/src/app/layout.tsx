import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace App", // Updated title
  description: "A multi-vendor marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Construct className using string concatenation
  const bodyClassName = [
    geistSans.variable,
    geistMono.variable,
    "antialiased",
    "flex",
    "flex-col",
    "min-h-screen",
  ].join(" ");

  return (
    <html lang="en">
      <body className={bodyClassName}>
        {/* SessionProvider needs to wrap components using useSession */}
        <SessionProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Toaster richColors />
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
