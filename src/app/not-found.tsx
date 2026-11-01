'use client';

// ==============================================================
// Custom 404 Page (not-found.tsx)
// Features: Eye-catching animated aurora 404 badge, compass illustration,
// direct "Return to Home" & "Browse Events" CTA buttons, and an
// instant search box redirecting to /upcoming-events.
// ==============================================================

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  Compass,
  Search,
  Sparkles,
  ArrowRight,
  PlusCircle,
  LogIn,
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/upcoming-events?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/upcoming-events');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Glowing 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 shadow-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span>Error 404 • Destination Not Found</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* Big Aurora 404 Numbers */}
        <div className="relative mb-6 select-none">
          <div className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 drop-shadow-sm">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-2xl pointer-events-none">
            <span className="text-9xl font-black text-sky-500">404</span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B2447] dark:text-[#E8F0FF] tracking-tight mb-3">
          Page Lost in the Community Matrix
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed mb-8">
          The drive, event details, or page you are looking for might have been concluded, moved, or never existed in the first place.
        </p>

        {/* Quick Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drives by name or topic..."
              className="w-full pl-10 pr-24 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-[#0c1630]/90 text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#0c1630] dark:hover:bg-[#0c1630]/80 text-[#0B2447] dark:text-[#E8F0FF] font-bold text-xs sm:text-sm border border-slate-200 dark:border-white/10 shadow-sm transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-sky-500" />
            <span>Browse Upcoming Drives</span>
          </Link>
        </div>

        {/* Helpful Shortcut Links Card */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#0c1630]/70 border border-slate-200/60 dark:border-white/5 backdrop-blur-md max-w-lg mx-auto">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-3">
            Helpful Destination Shortcuts:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <Link
              href="/create-event"
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#081024] hover:bg-sky-500/10 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/50 dark:border-white/5 transition-all flex items-center justify-center gap-1.5 font-medium"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </Link>

            <Link
              href="/login"
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#081024] hover:bg-sky-500/10 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/50 dark:border-white/5 transition-all flex items-center justify-center gap-1.5 font-medium"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/upcoming-events"
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#081024] hover:bg-sky-500/10 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/50 dark:border-white/5 transition-all flex items-center justify-center gap-1.5 font-medium col-span-2 sm:col-span-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>All Drives</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
