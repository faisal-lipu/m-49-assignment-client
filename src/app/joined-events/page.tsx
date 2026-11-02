'use client';

// ==============================================================
// Joined Events Page (/joined-events & /my-events) [Protected]
// Features: List of drives joined by the logged-in volunteer,
// impact metrics, live table & mobile card layouts, and SweetAlert2
// confirmation for cancelling participation.
// ==============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarCheck,
  Calendar,
  MapPin,
  ExternalLink,
  Sparkles,
  Lock,
  LogIn,
  Loader2,
  CheckCircle2,
  UserX,
  Compass,
  HeartHandshake,
  Clock,
  Award,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { fetchWithAuth, issueServerJwt, getToken } from '@/lib/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface JoinedEventRecord {
  _id: string; // Join record id
  eventId: string; // Original event id
  userEmail: string;
  userName?: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventType: string;
  thumbnail: string;
  joinedAt?: string;
}

export default function JoinedEventsPage() {
  const { data: session, isPending: isSessionLoading } = useSession();

  const [joinedEvents, setJoinedEvents] = useState<JoinedEventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const todayString = new Date().toISOString().split('T')[0];

  // Fetch joined events for the logged-in user
  const fetchJoinedList = useCallback(async () => {
    if (!session?.user?.email) return;
    setLoading(true);

    try {
      // Ensure backend JWT token is active
      let token = getToken();
      if (!token && session.user.email) {
        const tokenRes = await issueServerJwt(session.user.email);
        token = tokenRes?.token || null;
      }

      const res = await fetchWithAuth(
        `/api/events/joined/${encodeURIComponent(session.user.email)}`
      );
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setJoinedEvents(data.data);
      } else {
        setJoinedEvents([]);
      }
    } catch (err: unknown) {
      console.error('Fetch joined events error:', err);
      toast.error('Could not load your registered events.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchJoinedList();
    }
  }, [session, fetchJoinedList]);

  // Cancel Participation Action
  const handleCancelParticipation = async (recordId: string, eventTitle: string) => {
    const result = await Swal.fire({
      title: 'Cancel Participation?',
      text: `Are you sure you want to cancel your volunteer registration for "${eventTitle}"? Your spot will be made available to other community members.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel My Spot',
      cancelButtonText: 'Keep Registration',
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#64748b',
      background: document.documentElement.classList.contains('dark') ? '#0c1630' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#0f172a',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetchWithAuth(`/api/events/joined/${recordId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to cancel participation.');
      }

      // Remove from local list
      setJoinedEvents((prev) => prev.filter((item) => item._id !== recordId));
      toast.success('Your participation was cancelled. Spot released.');
    } catch (err: unknown) {
      console.error('Cancel participation error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to cancel participation.';
      toast.error(msg);
    }
  };

  // Category badge helper
  const getCategoryBadgeClass = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'donation':
        return 'bg-blue-500/80 text-white border-blue-400/40';
      case 'cleanup':
        return 'bg-teal-500/80 text-white border-teal-400/40';
      case 'plantation':
        return 'bg-emerald-500/80 text-white border-emerald-400/40';
      case 'food relief':
        return 'bg-pink-500/80 text-white border-pink-400/40';
      case 'healthcare':
        return 'bg-cyan-500/80 text-white border-cyan-400/40';
      case 'education':
        return 'bg-indigo-500/80 text-white border-indigo-400/40';
      default:
        return 'bg-sky-500/80 text-white border-sky-400/40';
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // -------------------------------------------------------------
  // Protected Route Guard
  // -------------------------------------------------------------
  if (isSessionLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-20 px-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500 mb-4" />
        <h2 className="text-lg font-bold text-[#0B2447] dark:text-[#E8F0FF]">
          Loading Your Registered Drives...
        </h2>
        <p className="text-xs text-slate-400 mt-1">Checking active session.</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white/90 dark:bg-[#0c1630]/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#0B2447] dark:text-[#E8F0FF] mb-2">
            Volunteer Sign In Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Please log in to review and manage the social service events you have registered to attend.
          </p>
          <div className="space-y-3">
            <Link
              href="/login?callbackUrl=/joined-events"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as Volunteer</span>
            </Link>
            <Link
              href="/upcoming-events"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium text-xs transition-all"
            >
              Browse Upcoming Drives
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate quick metrics
  const totalDrives = joinedEvents.length;
  const upcomingCount = joinedEvents.filter((ev) => ev.eventDate >= todayString).length;
  const estimatedHours = totalDrives * 4; // Average 4 volunteer hours per event

  return (
    <div className="min-h-screen py-12 sm:py-16 lg:py-20 pro-container mx-auto">
      {/* ----------------------------------------------------------- */}
      {/* 1. Header & Intro */}
      {/* ----------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-sm mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Volunteer Dashboard</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2447] dark:text-[#E8F0FF] tracking-tight">
            My Registered Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your volunteer schedules, event locations, and participation status.
          </p>
        </div>

        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Discover More Drives</span>
        </Link>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 2. Impact Summary Cards */}
      {/* ----------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0c1630]/90 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Drives Joined
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#0B2447] dark:text-[#E8F0FF]">
            {totalDrives}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Events registered</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0c1630]/90 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Upcoming Commitments
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {upcomingCount}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Future drives scheduled</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0c1630]/90 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Estimated Service Hours
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
            ~{estimatedHours}h
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Community impact contribution</span>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 3. Joined Events Table / Cards View */}
      {/* ----------------------------------------------------------- */}
      {loading ? (
        <div className="p-12 text-center bg-white/60 dark:bg-[#0c1630]/60 rounded-3xl border border-slate-200/80 dark:border-white/10">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto mb-3" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading your registered drives...</p>
        </div>
      ) : joinedEvents.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white/80 dark:bg-[#0c1630]/90 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 max-w-xl mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#0B2447] dark:text-[#E8F0FF] mb-2">
            No Events Registered Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            You have not joined any community drives yet. Explore upcoming cleanups, food relief programs, and tree plantations to make a positive impact!
          </p>
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore All Upcoming Events</span>
          </Link>
        </div>
      ) : (
        /* Events Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedEvents.map((rec) => (
            <article
              key={rec._id}
              className="group relative flex flex-col justify-between bg-white/90 dark:bg-[#0c1630]/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Card Banner Image */}
              <div className="relative w-full h-48 overflow-hidden bg-slate-900">
                <Image
                  src={
                    rec.thumbnail ||
                    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={rec.eventTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                {/* Floating Category Pill */}
                <div className="absolute top-3.5 left-3.5">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${getCategoryBadgeClass(
                      rec.eventType
                    )}`}
                  >
                    {rec.eventType}
                  </span>
                </div>

                {/* Floating Status Pill */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm border border-emerald-400/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirmed</span>
                  </span>
                </div>

                {/* Event ID Badge */}
                <div className="absolute bottom-3 left-3.5">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white/90 backdrop-blur-md text-[11px] font-mono border border-white/15">
                    ID: #{rec.eventId.slice(-6)}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/events/${rec.eventId}`}
                    className="font-bold text-base sm:text-lg text-[#0B2447] dark:text-[#E8F0FF] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 block mb-3"
                    title={rec.eventTitle}
                  >
                    {rec.eventTitle}
                  </Link>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
                      <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
                      <span>{formatDate(rec.eventDate)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">{rec.eventLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                  <Link
                    href={`/events/${rec.eventId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-[#E8F0FF] text-xs font-semibold transition-colors cursor-pointer"
                    title="View live event details"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-500" />
                    <span>View Event</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleCancelParticipation(rec._id, rec.eventTitle)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white dark:bg-rose-500/20 dark:hover:bg-rose-500 dark:text-rose-400 dark:hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
                    title="Cancel your participation"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Cancel Spot</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
