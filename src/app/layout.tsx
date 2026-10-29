// ==============================================================
// Root Layout
// Configures fonts, metadata, ThemeProvider, Navbar, Footer & Sonner Toaster
// ==============================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maitri - Social Development Events Platform",
  description:
    "A community-driven event management platform to create, join, and track local social service events.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-base-100 text-base-content antialiased`}>
        <ThemeProvider>
          {/* Global Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Toast Notification Container (No default alert!) */}
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
