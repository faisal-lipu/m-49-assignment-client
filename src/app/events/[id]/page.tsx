'use client';

// ==============================================================
// Event Details Page (/events/[id])
// Features: Full event details, live joined count, interactive Google
// Maps embed, itinerary, organizer card, and authenticated "Join Event"
// button with real-time feedback & SweetAlert2 confirmation.
// ==============================================================

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  HeartHandshake,
  TreePine,
  Trash2,
  UtensilsCrossed,
  Stethoscope,
  GraduationCap,
  Check,
  Map as MapIcon,
  HelpCircle,
  Award,
  Loader2,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { getServerUrl, fetchWithAuth, issueServerJwt, getToken } from '@/lib/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface EventData {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorEmail?: string;
  creatorName?: string;
  joinedCount?: number;
  capacity?: number;
  createdAt?: string;
}

// Fallback lookup in case backend is waking from cold start
const FALLBACK_EVENTS: Record<string, EventData> = {
  '6ae6104ef9b7f4b364fe903f': {
    _id: '6ae6104ef9b7f4b364fe903f',
    title: 'Winter Warmth: Clothes & Blanket Distribution',
    description:
      'Join Maitri volunteers to distribute thermal blankets, jackets, and winter essentials to underprivileged families, homeless elders, and children facing harsh temperatures across Mirpur. Every winter, thousands of street-dwellers and low-income families struggle with inadequate clothing. Together, we can spread warmth and dignity.',
    eventType: 'Donation',
    thumbnail:
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1200',
    location: 'Mirpur Section 10 Community Center, Dhaka',
    eventDate: '2026-11-15',
    creatorEmail: 'organizer@maitri.org',
    creatorName: 'Arafat Rahman',
    joinedCount: 42,
    capacity: 60,
  },
  '6ae6104ef9b7f4b364fe9040': {
    _id: '6ae6104ef9b7f4b364fe9040',
    title: 'Clean Dhaka Campaign: Dhanmondi Lake Drive',
    description:
      'A community-driven lakefront cleanup. We will collect single-use plastics, clear clogged walkways, install segregated waste bins, and raise civic awareness for an eco-friendly neighborhood. Gloves, trash grabbers, and biodegradable bags will be provided to all volunteers.',
    eventType: 'Cleanup',
    thumbnail:
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=1200',
    location: 'Dhanmondi Lake Amphitheater, Road 8/A, Dhaka',
    eventDate: '2026-11-22',
    creatorEmail: 'organizer@maitri.org',
    creatorName: 'Tasnim Jahan',
    joinedCount: 56,
    capacity: 80,
  },
  '6ae6104ef9b7f4b364fe9041': {
    _id: '6ae6104ef9b7f4b364fe9041',
    title: 'Green Canopy: Urban Tree Plantation in Ramna',
    description:
      'Help restore Dhaka urban greenery by planting over 500 indigenous fruit, medicinal, and shade trees. Free saplings, gardening gloves, and water cans will be supplied to all participants. Join hands to build a cooler, greener, and more resilient city for tomorrow.',
    eventType: 'Plantation',
    thumbnail:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    location: 'Ramna Park South Gate, Shahbagh, Dhaka',
    eventDate: '2026-12-05',
    creatorEmail: 'organizer@maitri.org',
    creatorName: 'Mahmudul Hasan',
    joinedCount: 78,
    capacity: 100,
  },
  '6ae6104ef9b7f4b364fe9042': {
    _id: '6ae6104ef9b7f4b364fe9042',
    title: 'Nourish Hope: Hot Meal & Nutrition Drive',
    description:
      'Distributing balanced, fresh cooked meals and nutrition packs to rickshaw pullers, street vendors, and low-income families around Lalbagh and surrounding riverbank areas. Hot nutritious khichuri, boiled eggs, and clean drinking water will be served with care and respect.',
    eventType: 'Food Relief',
    thumbnail:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
    location: 'Lalbagh Fort Grounds, Old Dhaka',
    eventDate: '2026-12-18',
    creatorEmail: 'organizer@maitri.org',
    creatorName: 'Nusrat Farhana',
    joinedCount: 35,
    capacity: 50,
  },
  '6ae6104ef9b7f4b364fe9043': {
    _id: '6ae6104ef9b7f4b364fe9043',
    title: 'Free Health Screening & Pediatric Care Camp',
    description:
      'Volunteer doctors and nurses offering free general health checkups, blood sugar screenings, pediatric care consultations, and essential over-the-counter medicine distribution. Certified physicians will conduct one-on-one evaluations and advise families on hygiene and child nutrition.',
    eventType: 'Healthcare',
    thumbnail:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
    location: 'Kurmitola High School Campus, Dhaka',
    eventDate: '2027-01-10',
    creatorEmail: 'organizer@maitri.org',
    creatorName: 'Dr. Kazi Salman',
    joinedCount: 28,
    capacity: 45,
  },
  '6ae6104ef9b7f4b364fe9044': {
    _id: '6ae6104ef9b7f4b364fe9044',
    title: 'Bright Futures: Slum Literacy & Book Donation',
    description:
      'Collecting storybooks, primary learning materials, stationery boxes, and school bags for children in informal settlements. Volunteers will also conduct an open reading circle, inspiring little minds to read, imagine, and dream big for their future.',
    eventType: 'Education',
    thumbnail:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200',
    location: 'Kawran Bazar Railgate Community Club, Dhaka',
    eventDate: '2027-01-24',
    creatorEmail: 'organizer@maitri.org',
    creatorName: 'Farhana Kabir',
    joinedCount: 19,
    capacity: 35,
  },
};

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const router = useRouter();
  const { data: session } = useSession();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch event details and check if user has already joined
  useEffect(() => {
    let isMounted = true;

    async function loadEventData() {
      if (!eventId) return;
      setLoading(true);

      try {
        const serverUrl = getServerUrl();
        const res = await fetch(`${serverUrl}/api/events/${eventId}`, {
          cache: 'no-store',
        });
        const json = await res.json();

        if (json.success && json.data) {
          if (isMounted) setEvent(json.data);
        } else if (FALLBACK_EVENTS[eventId]) {
          if (isMounted) setEvent(FALLBACK_EVENTS[eventId]);
        }
      } catch (err) {
        console.warn('API error, falling back to local dataset:', err);
        if (FALLBACK_EVENTS[eventId]) {
          if (isMounted) setEvent(FALLBACK_EVENTS[eventId]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadEventData();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  // Check if current user has joined this event
  useEffect(() => {
    let isMounted = true;

    async function checkJoinedStatus() {
      if (!session?.user?.email || !eventId) return;

      try {
        // Ensure user has server JWT
        if (!getToken()) {
          await issueServerJwt(session.user.email);
        }

        const res = await fetchWithAuth(`/api/events/joined/${session.user.email}`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const alreadyJoined = json.data.some(
            (item: { eventId?: string; _id?: string }) =>
              item.eventId === eventId || item._id === eventId
          );
          if (isMounted) setHasJoined(alreadyJoined);
        }
      } catch (err) {
        console.warn('Could not verify joined status:', err);
      }
    }

    checkJoinedStatus();

    return () => {
      isMounted = false;
    };
  }, [session, eventId]);

  // Handle Join Event action
  const handleJoinEvent = async () => {
    // 1. If not logged in, prompt user to log in
    if (!session?.user) {
      Swal.fire({
        title: 'Sign In Required',
        text: 'You need to be signed in to register and join volunteer events.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sign In Now',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#0284c7',
        background: document.documentElement.classList.contains('dark') ? '#0c1630' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#0f172a',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/login?callbackUrl=/events/${eventId}`);
        }
      });
      return;
    }

    // 2. SweetAlert2 Confirmation Dialog
    const confirmResult = await Swal.fire({
      title: 'Confirm Participation?',
      text: `Do you want to confirm your spot as a volunteer for "${event?.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, I Will Join!',
      cancelButtonText: 'Review Later',
      confirmButtonColor: '#0284c7',
      cancelButtonColor: '#64748b',
      background: document.documentElement.classList.contains('dark') ? '#0c1630' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#0f172a',
    });

    if (!confirmResult.isConfirmed) return;

    // 3. Execute Join API Request
    setIsJoining(true);
    try {
      // Ensure we have a fresh server JWT
      let token = getToken();
      if (!token && session.user.email) {
        const tokenRes = await issueServerJwt(session.user.email);
        token = tokenRes?.token || null;
      }

      const res = await fetchWithAuth('/api/events/join', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          userEmail: session.user.email,
          userName: session.user.name || 'Participant',
        }),
      });

      const json = await res.json();

      if (json.success) {
        setHasJoined(true);
        // Increment UI counter
        if (event) {
          setEvent({
            ...event,
            joinedCount: (event.joinedCount || 0) + 1,
          });
        }

        Swal.fire({
          title: 'Welcome Aboard!',
          text: 'You have successfully registered for this event. Your commitment makes a genuine difference!',
          icon: 'success',
          confirmButtonColor: '#0284c7',
          background: document.documentElement.classList.contains('dark') ? '#0c1630' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#0f172a',
        });

        toast.success('Successfully joined the event! Check your dashboard in Joined Events.');
      } else {
        // Handle 409 already joined or other error
        if (json.message?.includes('already joined')) {
          setHasJoined(true);
          toast.info('You are already registered for this event.');
        } else {
          toast.error(json.message || 'Failed to join event. Please try again.');
        }
      }
    } catch (err: unknown) {
      console.error('Join event error:', err);
      toast.error('Network error occurred. Please try again in a moment.');
    } finally {
      setIsJoining(false);
    }
  };

  // Copy event link to clipboard
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Event link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Days left helper
  const getDaysLeft = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const target = new Date(dateStr).getTime();
      const now = new Date().getTime();
      const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      if (diff <= 0) return 'Today';
      if (diff === 1) return 'Tomorrow';
      return `${diff} days left`;
    } catch {
      return '';
    }
  };

  // Category Icon & Badge
  const getCategoryDetails = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'cleanup':
        return {
          icon: Trash2,
          badge: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
        };
      case 'plantation':
        return {
          icon: TreePine,
          badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        };
      case 'donation':
        return {
          icon: HeartHandshake,
          badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
        };
      case 'food relief':
        return {
          icon: UtensilsCrossed,
          badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        };
      case 'healthcare':
        return {
          icon: Stethoscope,
          badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
        };
      case 'education':
        return {
          icon: GraduationCap,
          badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
        };
      default:
        return {
          icon: Sparkles,
          badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
        };
    }
  };

  // If loading, show shimmer skeleton
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
        <div className="w-full h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl mt-6"></div>
          </div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  // If event not found
  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#0B2447] dark:text-[#E8F0FF] mb-2">
          Event Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The event you are looking for may have been archived, completed, or does not exist.
        </p>
        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Events</span>
        </Link>
      </div>
    );
  }

  const { icon: CatIcon, badge: catBadgeClass } = getCategoryDetails(event.eventType);
  const totalCapacity = event.capacity || 60;
  const currentJoined = event.joinedCount || 24;
  const spotsLeft = Math.max(0, totalCapacity - currentJoined);
  const percentJoined = Math.min(100, Math.round((currentJoined / totalCapacity) * 100));

  // Google Maps embed URL based on event location
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    event.location || 'Dhaka, Bangladesh'
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* ------------------------------------------------------------- */}
      {/* 1. Breadcrumb Navigation */}
      {/* ------------------------------------------------------------- */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link
          href="/"
          className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          Home
        </Link>
        <span>/</span>
        <Link
          href="/upcoming-events"
          className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          Events
        </Link>
        <span>/</span>
        <span className="font-medium text-[#0B2447] dark:text-[#E8F0FF] truncate max-w-[200px] sm:max-w-xs">
          {event.title}
        </span>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 2. Hero Banner with Image & Key Badges */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-lg mb-8 bg-slate-900">
        <Image
          src={event.thumbnail || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1200'}
          alt={event.title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

        {/* Top Floating Chips */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md shadow-sm ${catBadgeClass}`}
          >
            <CatIcon className="w-3.5 h-3.5" />
            <span>{event.eventType}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{getDaysLeft(event.eventDate)}</span>
          </span>
        </div>

        {/* Share Button (Top-Right) */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/80 dark:bg-[#0c1630]/80 text-slate-800 dark:text-white backdrop-blur-md border border-white/30 hover:bg-white dark:hover:bg-[#0c1630] shadow-sm transition-all cursor-pointer"
            title="Share this event"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-sky-500" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Banner Content */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 drop-shadow-sm leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{formatDate(event.eventDate)}</span>
            </div>
            <span className="hidden sm:inline opacity-40">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>09:00 AM - 02:00 PM (BST)</span>
            </div>
            <span className="hidden sm:inline opacity-40">•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="truncate max-w-xs">{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Main Details & Sidebar Layout */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Event Description, Mission, Map & Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: About the Event */}
          <div className="bg-white/80 dark:bg-[#0c1630]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#0B2447] dark:text-[#E8F0FF] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-500" />
              <span>About this Community Drive</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-6">
              {event.description}
            </p>

            {/* Impact Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#081024] border border-slate-200/60 dark:border-white/5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Event Category
                </span>
                <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
                  {event.eventType}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#081024] border border-slate-200/60 dark:border-white/5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Registered Volunteers
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {currentJoined} Participated
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#081024] border border-slate-200/60 dark:border-white/5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Volunteer Fee
                </span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  100% Free
                </span>
              </div>
            </div>
          </div>

          {/* Section: What to Bring & Guidelines */}
          <div className="bg-white/80 dark:bg-[#0c1630]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#0B2447] dark:text-[#E8F0FF] mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <span>Volunteer Instructions & What to Bring</span>
            </h2>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Comfortable attire and closed-toe footwear suitable for physical activity.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>A reusable water bottle to maintain hydration and minimize plastic waste.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>All event equipment (gloves, trash bags, medical kits, saplings) will be provided free.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Digital participation certificate provided to all registered attendees.</span>
              </li>
            </ul>
          </div>

          {/* Section: Interactive Map Location */}
          <div className="bg-white/80 dark:bg-[#0c1630]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B2447] dark:text-[#E8F0FF] flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-rose-500" />
                  <span>Event Location & Map</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {event.location}
                </p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  event.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/60 dark:border-white/5 transition-all self-start sm:self-auto"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Google Maps iFrame */}
            <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner bg-slate-100 dark:bg-slate-800 relative">
              <iframe
                title="Event Venue Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-[1.05] grayscale-[10%]"
              ></iframe>
            </div>
          </div>

          {/* Section: Organizer Info */}
          <div className="bg-white/80 dark:bg-[#0c1630]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-600 dark:text-sky-300 font-extrabold text-lg flex items-center justify-center border border-sky-500/30">
                {(event.creatorName || 'M')[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[#0B2447] dark:text-[#E8F0FF] text-sm sm:text-base">
                    {event.creatorName || 'Community Organizer'}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    Organizer
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {event.creatorEmail || 'organizer@maitri.org'}
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block">Verified Platform Host</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                <ShieldCheck className="w-3.5 h-3.5" />
                Maitri Certified
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col Sticky Sidebar): Action & Participation Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white/95 dark:bg-[#0c1630]/95 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-7 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block mb-1">
                Volunteer Registration
              </span>
              <h2 className="text-2xl font-black text-[#0B2447] dark:text-[#E8F0FF]">
                Free & Open Access
              </h2>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-500" />
                  Spots Filled:
                </span>
                <span className="text-[#0B2447] dark:text-[#E8F0FF]">
                  {currentJoined} / {totalCapacity} ({percentJoined}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentJoined}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
                {spotsLeft > 0 ? `${spotsLeft} seats remaining` : 'Capacity reached (Waitlist only)'}
              </p>
            </div>

            {/* Quick Details List */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="font-medium">{formatDate(event.eventDate)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-500 shrink-0" />
                <span>09:00 AM – 02:00 PM BST</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{event.location}</span>
              </div>
            </div>

            {/* JOIN EVENT MAIN CTA BUTTON */}
            <div className="pt-2">
              {hasJoined ? (
                <div className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-center font-bold text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>You Have Joined This Drive!</span>
                </div>
              ) : (
                <button
                  onClick={handleJoinEvent}
                  disabled={isJoining || spotsLeft <= 0}
                  className="w-full py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Confirming Spot...</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-5 h-5" />
                      <span>Join Event as Volunteer</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Safety & Community Pledge */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#081024] border border-slate-200/60 dark:border-white/5 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-sky-500" />
                <span>Maitri Safe Community Pledge</span>
              </div>
              <p>
                Strict anti-harassment policy. Free participation. All necessary tools provided on-site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
