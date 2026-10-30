"use client";

// ==============================================================
// Navbar Component
// Includes App Logo (Maitri), Upcoming Events link, Theme Toggle,
// and Conditional Login / Profile Avatar Dropdown with Hover Name
// ==============================================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";
import { HeartHandshake, PlusCircle, CalendarCheck, CalendarDays, LogOut, LogIn, User } from "lucide-react";
import { toast } from "sonner";
import { clearToken, getServerUrl } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Handle Logout
  const handleLogout = async () => {
    try {
      // 1. Sign out from BetterAuth client
      await signOut();

      // 2. Also clear server-side JWT cookie and local token
      clearToken();
      await fetch(`${getServerUrl()}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      toast.success("Logged out successfully. See you soon!");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-200 transition-colors shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl navbar h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Navigation */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl sm:text-2xl text-primary hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold tracking-tight">
              Maitri
            </span>
          </Link>
        </div>

        {/* Center / Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors text-base-content/80 hover:text-base-content"
          >
            Home
          </Link>
          <Link
            href="/upcoming-events"
            className="text-sm font-medium hover:text-primary transition-colors text-base-content/80 hover:text-base-content"
          >
            Upcoming Events
          </Link>
        </div>

        {/* Right Side: Theme Toggle & Conditional Auth */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Conditional Auth Rendering */}
          {isPending ? (
            // Loading skeleton while checking session
            <div className="w-9 h-9 rounded-full bg-base-300 animate-pulse" />
          ) : user ? (
            // Logged-in State: Profile picture with hover name and dropdown
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border-2 border-primary/40 hover:border-primary transition-all p-0.5"
                title={user.name || "User Profile"} // Hovering shows display name
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User Avatar"}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="font-bold text-sm text-primary uppercase">
                      {user.name ? user.name.charAt(0) : "U"}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              <ul
                tabIndex={0}
                className="dropdown-content menu z-[60] mt-3 p-2 shadow-2xl bg-base-100 rounded-2xl w-60 border border-base-200"
              >
                {/* User Info Header */}
                <li className="menu-title px-4 py-2 border-b border-base-200 mb-1">
                  <div className="font-semibold text-base-content text-sm truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-base-content/60 truncate font-normal">
                    {user.email}
                  </div>
                </li>

                {/* Dropdown Links */}
                <li>
                  <Link href="/profile" className="py-2.5 flex items-center gap-2.5 text-sm hover:text-primary">
                    <User className="w-4 h-4 text-primary" />
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link href="/create-event" className="py-2.5 flex items-center gap-2.5 text-sm hover:text-primary">
                    <PlusCircle className="w-4 h-4 text-primary" />
                    <span>Create Event</span>
                  </Link>
                </li>
                <li>
                  <Link href="/manage-events" className="py-2.5 flex items-center gap-2.5 text-sm hover:text-primary">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span>Manage Events</span>
                  </Link>
                </li>
                <li>
                  <Link href="/joined-events" className="py-2.5 flex items-center gap-2.5 text-sm hover:text-primary">
                    <CalendarCheck className="w-4 h-4 text-primary" />
                    <span>Joined Events</span>
                  </Link>
                </li>

                <div className="divider my-1"></div>

                {/* Logout Button */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="py-2.5 flex items-center gap-2.5 text-sm text-error hover:bg-error/10 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            // Logged-out State: Show Login Button
            <Link
              href="/login"
              className="btn btn-primary btn-sm rounded-xl px-4 gap-1.5 shadow-sm hover:shadow transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
