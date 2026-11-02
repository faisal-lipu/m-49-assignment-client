'use client';

// ==============================================================
// Create Event Page (/create-event & /events/create) [Protected]
// Features: Protected authentication check, future date validation,
// read-only user info, image preview with 1-click Unsplash presets,
// category selector, SweetAlert2 success modal & backend API sync.
// ==============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarPlus,
  MapPin,
  Image as ImageIcon,
  FileText,
  User,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  LogIn,
  Tag,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { fetchWithAuth, issueServerJwt, getToken } from '@/lib/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import ConflictAwareDatePicker from '@/components/ConflictAwareDatePicker';

// Preset high-quality images for easy testing
const IMAGE_PRESETS = [
  {
    label: 'Cleanup',
    category: 'Cleanup',
    url: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=1200',
  },
  {
    label: 'Tree Plantation',
    category: 'Plantation',
    url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1200',
  },
  {
    label: 'Winter Clothes',
    category: 'Donation',
    url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1200',
  },
  {
    label: 'Food Relief',
    category: 'Food Relief',
    url: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&q=80&w=1200',
  },
  {
    label: 'Health Camp',
    category: 'Healthcare',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
  },
  {
    label: 'Books & Literacy',
    category: 'Education',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200',
  },
];

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

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();

  // Form states
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('Cleanup');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [thumbnail, setThumbnail] = useState(IMAGE_PRESETS[0].url);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Today in YYYY-MM-DD for date input minimum constraint
  const todayString = new Date().toISOString().split('T')[0];

  // Handle Preset Selection
  const handleSelectPreset = (preset: (typeof IMAGE_PRESETS)[0]) => {
    setThumbnail(preset.url);
    setEventType(preset.category);
    toast.info(`Selected "${preset.label}" image & category.`);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Client-side field validations
    if (!title.trim()) {
      setErrorMsg('Please enter an event title.');
      return;
    }

    if (!eventDate) {
      setErrorMsg('Please select an event date.');
      return;
    }

    // 2. Future Date Validation (Mandatory requirement)
    if (eventDate < todayString) {
      setErrorMsg('Event date must be today or in the future. Past dates are not allowed.');
      toast.error('Event date must be in the future. Past dates are not allowed.');
      return;
    }

    if (!location.trim()) {
      setErrorMsg('Please enter the event location venue.');
      return;
    }

    if (!thumbnail.trim()) {
      setErrorMsg('Please provide a valid image URL for the event thumbnail.');
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      setErrorMsg('Description should be at least 20 characters detailing the drive mission.');
      return;
    }

    setLoading(true);

    try {
      // 3. Ensure we have an active backend JWT
      let token = getToken();
      if (!token && session?.user?.email) {
        const tokenRes = await issueServerJwt(session.user.email);
        token = tokenRes?.token || null;
      }

      // 4. Send POST request to backend API
      const res = await fetchWithAuth('/api/events', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventType,
          thumbnail: thumbnail.trim(),
          location: location.trim(),
          eventDate,
          creatorEmail: session?.user?.email || '',
          creatorName: session?.user?.name || 'Organizer',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create event.');
      }

      // 5. Success confirmation modal & redirect to Upcoming Events
      toast.success('Event published successfully!');
      await Swal.fire({
        title: 'Event Published Successfully!',
        text: `"${title}" has been created. Redirecting to Upcoming Events...`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: true,
        confirmButtonText: 'Go to Upcoming Events',
        confirmButtonColor: '#0284c7',
        background: document.documentElement.classList.contains('dark') ? '#0c1630' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#0f172a',
      });

      router.push('/upcoming-events');
    } catch (err: unknown) {
      console.error('Create event error:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setTitle('');
    setEventType('Cleanup');
    setEventDate('');
    setLocation('');
    setThumbnail(IMAGE_PRESETS[0].url);
    setDescription('');
    setErrorMsg(null);
  };

  // -------------------------------------------------------------
  // Protected Route Check
  // -------------------------------------------------------------
  if (isSessionLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-20 px-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500 mb-4" />
        <h2 className="text-lg font-bold text-[#0B2447] dark:text-[#E8F0FF]">
          Checking Organizer Credentials...
        </h2>
        <p className="text-xs text-slate-400 mt-1">Please wait a moment.</p>
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
            Creating a social development drive requires a verified account to ensure community safety and organizer credibility.
          </p>
          <div className="space-y-3">
            <Link
              href="/login?callbackUrl=/create-event"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as Organizer</span>
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
    <div className="min-h-screen py-12 sm:py-16 lg:py-20 pro-container mx-auto">
      <div className="max-w-4xl mx-auto">
      {/* ----------------------------------------------------------- */}
      {/* 1. Header Banner */}
      {/* ----------------------------------------------------------- */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300 shadow-sm mb-3">
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>Organizer Studio</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B2447] dark:text-[#E8F0FF] tracking-tight">
          Create a Community Event
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Mobilize volunteers, organize local drives, and bring meaningful change to your neighborhood.
        </p>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 2. Main Form Card */}
      {/* ----------------------------------------------------------- */}
      <div className="bg-white/90 dark:bg-[#0c1630]/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 shadow-xl">
        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-medium flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Event Title */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#0B2447] dark:text-[#E8F0FF] mb-1.5">
              Event Title *
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Winter Warmth: Clothes & Blanket Distribution"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Row 2: Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Event Category */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0B2447] dark:text-[#E8F0FF] mb-1.5">
                Event Category *
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-medium cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event Location */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0B2447] dark:text-[#E8F0FF] mb-1.5">
                Event Location & Venue *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhanmondi Lake Amphitheater, Road 8/A, Dhaka"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Event Date (Smart Conflict-Aware Month Calendar) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#0B2447] dark:text-[#E8F0FF]">
                Event Date (Conflict-Aware Calendar) *
              </label>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Future dates only • Conflict locked
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              Dates with existing community drives are locked to prevent volunteer fragmentation. Hover over marked dates to inspect scheduled drives with brief descriptions.
            </p>

            <ConflictAwareDatePicker
              value={eventDate}
              onChange={(date) => setEventDate(date)}
            />
            <input type="hidden" name="eventDate" value={eventDate} required />
          </div>

          {/* Row 4: Thumbnail Image URL with One-Click Presets & Live Preview */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#0B2447] dark:text-[#E8F0FF] mb-1.5">
              Event Banner Image URL *
            </label>
            <div className="relative mb-2">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                required
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-medium"
              />
            </div>

            {/* Quick 1-Click Image Presets */}
            <div className="mb-3">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                Quick 1-Click Image Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`py-1 px-2.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                      thumbnail === preset.url
                        ? 'bg-sky-500 text-white border-sky-500 shadow-2xs font-semibold'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-sky-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Banner Preview Box */}
            {thumbnail && (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 shadow-inner">
                <Image
                  src={thumbnail}
                  alt="Banner preview"
                  fill
                  sizes="(max-width: 800px) 100vw, 800px"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-md">
                  Live Banner Preview
                </div>
              </div>
            )}
          </div>

          {/* Row 5: Description */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#0B2447] dark:text-[#E8F0FF] mb-1.5">
              Event Description & Mission Details *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the volunteer objectives, schedule, target community, and equipment provided..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-medium leading-relaxed"
            ></textarea>
            <span className="text-[11px] text-slate-400 block mt-1">
              Minimum 20 characters. Be concise and motivating for prospective volunteers.
            </span>
          </div>

          {/* Row 6: Organizer Details (Pre-filled & Read-only) */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#081024]/80 border border-slate-200/80 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Organizer Information (Auto-filled & Verified)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Authenticated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-white/5">
                <User className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Name:</span>
                <span className="font-semibold text-[#0B2447] dark:text-[#E8F0FF] truncate">
                  {session.user.name || 'Organizer'}
                </span>
                <Lock className="w-3 h-3 text-slate-400 ml-auto shrink-0" title="Read-only" />
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-white/5">
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Email:</span>
                <span className="font-semibold text-[#0B2447] dark:text-[#E8F0FF] truncate">
                  {session.user.email}
                </span>
                <Lock className="w-3 h-3 text-slate-400 ml-auto shrink-0" title="Read-only" />
              </div>
            </div>
          </div>

          {/* Row 7: Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Drive to Platform...</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4" />
                  <span>Publish Community Event</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-white/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
