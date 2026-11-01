'use client';

// ==============================================================
// Manage Events Page (/manage-events) [Protected]
// Features: List of events created by the logged-in user, responsive
// table & mobile cards, interactive Edit Modal with future date validation,
// SweetAlert2 delete confirmation, and live stats overview.
// ==============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarDays,
  Calendar,
  MapPin,
  Pencil,
  Trash2,
  ExternalLink,
  PlusCircle,
  Sparkles,
  Lock,
  LogIn,
  Loader2,
  X,
  Save,
  FolderOpen,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { fetchWithAuth, issueServerJwt, getToken } from '@/lib/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface ManagedEvent {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
  creatorName?: string;
  createdAt?: string;
}

const CATEGORY_OPTIONS = [
  'Cleanup',
  'Plantation',
  'Donation',
  'Food Relief',
  'Healthcare',
  'Education',
  'Animal Welfare',
  'Community',
];

export default function ManageEventsPage() {
  const { data: session, isPending: isSessionLoading } = useSession();

  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<ManagedEvent | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Cleanup');
  const [editDate, setEditDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const todayString = new Date().toISOString().split('T')[0];

  // Fetch events created by current logged-in user
  const fetchMyEvents = useCallback(async () => {
    if (!session?.user?.email) return;
    setLoading(true);

    try {
      // Ensure backend JWT token is active
      let token = getToken();
      if (!token && session.user.email) {
        const tokenRes = await issueServerJwt(session.user.email);
        token = tokenRes?.token || null;
      }

      const res = await fetchWithAuth(`/api/events/user/${encodeURIComponent(session.user.email)}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } catch (err: unknown) {
      console.error('Fetch my events error:', err);
      toast.error('Could not load your created events.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyEvents();
    }
  }, [session, fetchMyEvents]);

  // Open Edit Modal with event data
  const handleOpenEdit = (ev: ManagedEvent) => {
    setEditingEvent(ev);
    setEditTitle(ev.title);
    setEditCategory(ev.eventType || 'Cleanup');
    setEditDate(ev.eventDate);
    setEditLocation(ev.location);
    setEditThumbnail(ev.thumbnail);
    setEditDescription(ev.description);
  };

  // Close Edit Modal
  const handleCloseEdit = () => {
    setEditingEvent(null);
    setIsUpdating(false);
  };

  // Submit Updated Event
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    // Future date validation
    if (editDate < todayString) {
      toast.error('Updated date must be in the future. Past dates are not allowed.');
      return;
    }

    setIsUpdating(true);

    try {
      const res = await fetchWithAuth(`/api/events/${editingEvent._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editTitle.trim(),
          eventType: editCategory,
          eventDate: editDate,
          location: editLocation.trim(),
          thumbnail: editThumbnail.trim(),
          description: editDescription.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update event.');
      }

      // Update local state
      setEvents((prev) =>
        prev.map((item) =>
          item._id === editingEvent._id
            ? {
                ...item,
                title: editTitle.trim(),
                eventType: editCategory,
                eventDate: editDate,
                location: editLocation.trim(),
                thumbnail: editThumbnail.trim(),
                description: editDescription.trim(),
              }
            : item
        )
      );

      toast.success('Event updated successfully!');
      handleCloseEdit();
    } catch (err: unknown) {
      console.error('Update event error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to update event.';
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Event Deletion
  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: 'Delete this Event?',
      text: `Are you sure you want to permanently delete "${title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Permanently',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      background: document.documentElement.classList.contains('dark') ? '#0c1630' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#0f172a',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetchWithAuth(`/api/events/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete event.');
      }

      // Remove from local list
      setEvents((prev) => prev.filter((item) => item._id !== id));
      toast.success('Event deleted successfully.');
    } catch (err: unknown) {
      console.error('Delete error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to delete event.';
      toast.error(msg);
    }
  };

  // Format date
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
          Loading Organizer Dashboard...
        </h2>
        <p className="text-xs text-slate-400 mt-1">Verifying your active session.</p>
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
            Organizer Sign In Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            You must be logged in to manage, update, or remove your organized community drives.
          </p>
          <div className="space-y-3">
            <Link
              href="/login?callbackUrl=/manage-events"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Manage</span>
            </Link>
            <Link
              href="/upcoming-events"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium text-xs transition-all"
            >
              Back to Upcoming Drives
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ----------------------------------------------------------- */}
      {/* 1. Header & Actions */}
      {/* ----------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300 shadow-sm mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Organizer Console</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2447] dark:text-[#E8F0FF] tracking-tight">
            Manage My Organized Drives
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review, edit event schedules, and manage volunteer drives created under your account.
          </p>
        </div>

        <Link
          href="/create-event"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Organize New Drive</span>
        </Link>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 2. Quick Metrics Bar */}
      {/* ----------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0c1630]/90 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Total Drives Organized
          </span>
          <span className="text-2xl font-black text-[#0B2447] dark:text-[#E8F0FF]">
            {events.length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0c1630]/90 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Active Upcoming Drives
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {events.filter((e) => e.eventDate >= todayString).length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0c1630]/90 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Organizer Profile
          </span>
          <span className="text-sm font-bold text-sky-600 dark:text-sky-400 truncate block">
            {session.user.email}
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 3. Table / Cards View */}
      {/* ----------------------------------------------------------- */}
      {loading ? (
        <div className="p-12 text-center bg-white/60 dark:bg-[#0c1630]/60 rounded-3xl border border-slate-200/80 dark:border-white/10">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto mb-3" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading your events...</p>
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white/80 dark:bg-[#0c1630]/90 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 max-w-xl mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#0B2447] dark:text-[#E8F0FF] mb-2">
            No Events Organized Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            You have not created any community drives with this account yet. Mobilize volunteers for cleanups, donations, or tree plantations today!
          </p>
          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Event</span>
          </Link>
        </div>
      ) : (
        /* Events Table (Desktop) & Cards (Mobile) */
        <div className="bg-white/90 dark:bg-[#0c1630]/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xl">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/90 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-4 px-6">Event Details</th>
                  <th scope="col" className="py-4 px-4">Category</th>
                  <th scope="col" className="py-4 px-4">Date</th>
                  <th scope="col" className="py-4 px-4">Location</th>
                  <th scope="col" className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {events.map((ev) => (
                  <tr
                    key={ev._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* Event Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800">
                          <Image
                            src={ev.thumbnail || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=300'}
                            alt={ev.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <Link
                            href={`/events/${ev._id}`}
                            className="font-bold text-[#0B2447] dark:text-[#E8F0FF] hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-1 block text-sm"
                          >
                            {ev.title}
                          </Link>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {ev.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        {ev.eventType}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span>{formatDate(ev.eventDate)}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 max-w-[180px]">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/events/${ev._id}`}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          title="View live event"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ev)}
                          className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-600 hover:text-white dark:bg-sky-500/20 dark:hover:bg-sky-500 dark:text-sky-300 dark:hover:text-white transition-all cursor-pointer"
                          title="Edit event"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(ev._id, ev.title)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white dark:bg-rose-500/20 dark:hover:bg-rose-500 dark:text-rose-400 dark:hover:text-white transition-all cursor-pointer"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-white/5">
            {events.map((ev) => (
              <div key={ev._id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={ev.thumbnail || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=300'}
                      alt={ev.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        {ev.eventType}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-sky-500" />
                        {formatDate(ev.eventDate)}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#0B2447] dark:text-[#E8F0FF] line-clamp-1">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      {ev.location}
                    </p>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
                  <Link
                    href={`/events/${ev._id}`}
                    className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold"
                  >
                    <span>View Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ev)}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ev._id, ev.title)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 4. Edit Event Modal */}
      {/* ----------------------------------------------------------- */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0c1630] rounded-3xl border border-slate-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#0B2447] dark:text-[#E8F0FF]">
                    Update Community Event
                  </h3>
                  <p className="text-[11px] text-slate-400">Modify details for your scheduled drive.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseEdit}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date * (Future dates only)
                  </label>
                  <input
                    type="date"
                    required
                    min={todayString}
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 cursor-pointer"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location Venue *
                </label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Banner Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editThumbnail}
                  onChange={(e) => setEditThumbnail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Mission Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 leading-relaxed"
                ></textarea>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
