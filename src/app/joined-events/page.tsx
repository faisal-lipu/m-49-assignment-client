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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
        /* Events Table (Desktop) & Cards (Mobile) */
        <div className="bg-white/90 dark:bg-[#0c1630]/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xl">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/90 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-4 px-6">Event Details</th>
                  <th scope="col" className="py-4 px-4">Category</th>
                  <th scope="col" className="py-4 px-4">Scheduled Date</th>
                  <th scope="col" className="py-4 px-4">Venue Location</th>
                  <th scope="col" className="py-4 px-4">Status</th>
                  <th scope="col" className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {joinedEvents.map((rec) => (
                  <tr
                    key={rec._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* Event Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800">
                          <Image
                            src={rec.thumbnail || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=300'}
                            alt={rec.eventTitle}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <Link
                            href={`/events/${rec.eventId}`}
                            className="font-bold text-[#0B2447] dark:text-[#E8F0FF] hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-1 block text-sm"
                          >
                            {rec.eventTitle}
                          </Link>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            ID: #{rec.eventId.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        {rec.eventType}
                      </span>
                    </td>

                    {/* Scheduled Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span>{formatDate(rec.eventDate)}</span>
                      </div>
                    </td>

                    {/* Venue Location */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 max-w-[170px]">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{rec.eventLocation}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Confirmed</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/events/${rec.eventId}`}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          title="View event details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleCancelParticipation(rec._id, rec.eventTitle)}
                          className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white dark:bg-rose-500/20 dark:hover:bg-rose-500 dark:text-rose-400 dark:hover:text-white text-xs font-semibold transition-all cursor-pointer"
                          title="Cancel your participation"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Cancel Spot</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-white/5">
            {joinedEvents.map((rec) => (
              <div key={rec._id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={rec.thumbnail || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=300'}
                      alt={rec.eventTitle}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        {rec.eventType}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#0B2447] dark:text-[#E8F0FF] line-clamp-1">
                      {rec.eventTitle}
                    </h3>

                    <div className="flex flex-col gap-0.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-sky-500" />
                        {formatDate(rec.eventDate)}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        {rec.eventLocation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
                  <Link
                    href={`/events/${rec.eventId}`}
                    className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold"
                  >
                    <span>View Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleCancelParticipation(rec._id, rec.eventTitle)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                  >
                    <UserX className="w-3 h-3" />
                    <span>Cancel Participation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
