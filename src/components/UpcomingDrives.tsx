'use client';

// ==============================================================
// UpcomingDrives Component
// Displays exactly 6 verified community social drives with:
// - Fully centered header section (title, badge, description)
// - Unique & distinct high-quality visual thumbnails for each card
// - Real-time progress bars, category tags, and responsive grid
// - Direct link to event details and full community directory
// ==============================================================

import Link from 'next/link';
import {
  ArrowUpRight,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';

export interface DriveEvent {
  id?: string;
  _id?: string;
  title: string;
  category?: string;
  eventType?: string;
  date?: string;
  eventDate?: string;
  location: string;
  joined?: number;
  capacity?: number;
  thumbnail?: string;
}

// 6 Unique & Distinct Images for Social Work & Community Drives
// (Each card gets an exclusive, high-impact photo distinct from any mentor project)
export const UNIQUE_DRIVE_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&q=80&w=800', // 1. Food Relief & Warm Meals
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', // 2. Youth Literacy & Book Camp
  'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=800', // 3. Lakefront & Neighborhood Cleanup
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800', // 4. Urban Tree Plantation Drive
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800', // 5. Winter Warmth & Blanket Distribution
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800', // 6. Free Health Screening & Pediatric Care
];

export const SAMPLE_EVENTS: DriveEvent[] = [
  {
    id: '1',
    title: 'Nutrition Relief: Hot Meals Distribution',
    category: 'food relief',
    date: '2026-11-05T08:00:00',
    location: 'Cox’s Bazar Sadar, Bangladesh',
    joined: 28,
    capacity: 45,
    thumbnail: UNIQUE_DRIVE_IMAGES[0],
  },
  {
    id: '2',
    title: 'Bright Horizons: Primary Education Camp',
    category: 'education',
    date: '2026-11-12T09:00:00',
    location: 'Mirpur 10, Dhaka',
    joined: 22,
    capacity: 35,
    thumbnail: UNIQUE_DRIVE_IMAGES[1],
  },
  {
    id: '3',
    title: 'Clean Dhaka: Dhanmondi Lake Cleanup',
    category: 'cleanup',
    date: '2026-11-18T07:30:00',
    location: 'Dhanmondi Lake Amphitheater, Dhaka',
    joined: 34,
    capacity: 50,
    thumbnail: UNIQUE_DRIVE_IMAGES[2],
  },
  {
    id: '4',
    title: 'Green Canopy: Urban Tree Plantation',
    category: 'plantation',
    date: '2026-11-25T08:30:00',
    location: 'Ramna Park, Shahbagh, Dhaka',
    joined: 19,
    capacity: 40,
    thumbnail: UNIQUE_DRIVE_IMAGES[3],
  },
  {
    id: '5',
    title: 'Winter Warmth: Blanket Distribution',
    category: 'donation',
    date: '2026-12-02T10:00:00',
    location: 'Kurmitola High School, Dhaka',
    joined: 41,
    capacity: 60,
    thumbnail: UNIQUE_DRIVE_IMAGES[4],
  },
  {
    id: '6',
    title: 'Free Pediatric Care & Medical Camp',
    category: 'health',
    date: '2026-12-10T09:00:00',
    location: 'Lalbagh Community Grounds, Old Dhaka',
    joined: 15,
    capacity: 30,
    thumbnail: UNIQUE_DRIVE_IMAGES[5],
  },
];

const CAT: Record<string, { c: string; tint: string; label: string }> = {
  education: { c: '#7B61FF', tint: 'rgba(123,97,255,0.18)', label: 'Education' },
  health: { c: '#10B981', tint: 'rgba(16,185,129,0.18)', label: 'Health' },
  environment: { c: '#0891B2', tint: 'rgba(8,145,178,0.18)', label: 'Environment' },
  community: { c: '#3B6CFF', tint: 'rgba(59,108,255,0.18)', label: 'Community' },
  donation: { c: '#3B6CFF', tint: 'rgba(59,108,255,0.18)', label: 'Donation' },
  cleanup: { c: '#0891B2', tint: 'rgba(8,145,178,0.18)', label: 'Cleanup' },
  plantation: { c: '#10B981', tint: 'rgba(16,185,129,0.18)', label: 'Plantation' },
  'food relief': { c: '#FF6B9A', tint: 'rgba(255,107,154,0.18)', label: 'Food Relief' },
  healthcare: { c: '#10B981', tint: 'rgba(16,185,129,0.18)', label: 'Healthcare' },
  'animal welfare': { c: '#F59E0B', tint: 'rgba(245,158,11,0.18)', label: 'Animal Welfare' },
};

const SECTION_BG = 'bg-[#F2FBFF] dark:bg-[#0A1128]';
const muted = 'text-[#35507A] dark:text-[#8EA0C4]';
const edge = 'border-[#D6F3FA] dark:border-white/10';

interface TicketProps {
  ev?: DriveEvent;
  index?: number;
}

/* ---------- 6-card event item ---------- */
function Ticket({ ev, index = 0 }: TicketProps) {
  const catKey = (ev?.category || ev?.eventType || 'community').toLowerCase();
  const cat = CAT[catKey] ?? CAT.community;

  const rawDate = ev?.date || ev?.eventDate;
  const d = rawDate ? new Date(rawDate) : new Date();

  const joinedCount = ev?.joined ?? 18;
  const totalCapacity = ev?.capacity ?? 40;
  const pct = Math.min(100, Math.round((joinedCount / totalCapacity) * 100));
  const left = Math.max(0, totalCapacity - joinedCount);
  const eventId = ev?.id || ev?._id || '1';

  // Fallback to our 6 unique distinct images if ev.thumbnail is missing or invalid
  const hasValidCustomThumb =
    ev?.thumbnail &&
    !ev.thumbnail.includes('gstatic.com') &&
    !ev.thumbnail.includes('scene7.com');

  const cardImage = hasValidCustomThumb
    ? ev.thumbnail!
    : UNIQUE_DRIVE_IMAGES[index % UNIQUE_DRIVE_IMAGES.length];

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 dark:bg-[#131C3A] ${edge} shadow-[0_12px_36px_-18px_rgba(0,120,200,0.35)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(0,184,217,0.45)] dark:shadow-none dark:hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.35)]`}
    >
      {/* 1. Card Top: Distinct High-Resolution Visual Banner */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cardImage}
          alt={ev?.title || 'Community Drive'}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Floating Category Pill */}
        <div className="absolute top-3.5 left-3.5">
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md shadow-sm border border-white/20"
            style={{ background: cat.tint, color: cat.c }}
          >
            {cat.label}
          </span>
        </div>

        {/* Floating Date Badge */}
        <div className="absolute top-3.5 right-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
            <Clock className="h-3.5 w-3.5 text-sky-400" />
            <span>{d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
          </span>
        </div>

        {/* Floating Location on Bottom Left of Image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center gap-1.5 text-xs font-medium text-white/90 truncate">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-400" />
          <span className="truncate">{ev?.location || 'Dhaka, Bangladesh'}</span>
        </div>
      </div>

      {/* 2. Card Body: Title, Metrics & Actions */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold leading-snug line-clamp-1 text-[#0B2447] dark:text-[#E8F0FF] group-hover:text-sky-500 transition-colors">
            {ev?.title}
          </h3>

          {/* Time & Scheduling */}
          <div className={`mt-2 flex items-center gap-2 text-xs font-medium ${muted}`}>
            <Clock className="h-3.5 w-3.5 shrink-0 text-sky-500" />
            <span>
              {d.toLocaleDateString('en-GB', { weekday: 'short' })},{' '}
              {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Progress & Join Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" style={{ color: cat.c }} />
              <span>{joinedCount} joined</span>
            </span>
            <span className={muted}>{left > 0 ? `${left} spots left` : 'Full'}</span>
          </div>

          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E6F2F8] dark:bg-white/10"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Volunteer spots filled"
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${cat.c}, #00C6FF)`,
              }}
            />
          </div>

          <Link
            href={`/events/${eventId}`}
            className="group/btn mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#0B2447] hover:bg-sky-500 active:bg-sky-600 text-white font-bold py-2.5 text-xs sm:text-sm shadow-sm hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-300 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-white cursor-pointer hover:-translate-y-0.5"
          >
            <span>View and join</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

interface UpcomingDrivesProps {
  events?: DriveEvent[];
}

/* ---------- section ---------- */
export default function UpcomingDrives({ events = [] }: UpcomingDrivesProps) {
  // Always display exactly 6 events as required by the specifications
  const baseList = events.length > 0 ? events : SAMPLE_EVENTS;
  const shownEvents =
    baseList.length >= 6
      ? baseList.slice(0, 6)
      : [
          ...baseList,
          ...SAMPLE_EVENTS.filter((s) => !baseList.some((e) => e.title === s.title)),
        ].slice(0, 6);

  const has = shownEvents.length > 0;

  return (
    <section
      id="upcoming"
      className={`relative overflow-hidden py-20 lg:py-28 text-[#0B2447] dark:text-[#E8F0FF] scroll-mt-20 ${SECTION_BG}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#00C6FF]/20 blur-[100px] dark:bg-[#22D3EE]/10"
      />

      <div className="relative mx-auto pro-container">
        {/* Red Boxed Section Header: Fully Centered */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p
            className={`mb-3 inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-1 text-xs font-semibold dark:bg-[#131C3A]/70 ${edge}`}
          >
            <span className={`h-2 w-2 rounded-full ${has ? 'bg-[#2DE2C0]' : 'bg-[#FFB020]'}`} />
            {has
              ? `${shownEvents.length} drives open for volunteers`
              : 'Waiting for the first drive'}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0B2447] dark:text-[#E8F0FF] sm:text-4xl lg:text-5xl">
            Next in line in your city
          </h2>
          <p className={`mt-2.5 max-w-xl mx-auto text-sm sm:text-base ${muted}`}>
            Scheduled social events that need volunteers like you.
          </p>
        </div>

        {/* 6 Cards Grid as required */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shownEvents.map((ev, index) => (
            <Ticket key={ev.id || ev._id || index} ev={ev} index={index} />
          ))}
        </div>

        {/* Centered Action Button */}
        <div className="mt-12 text-center">
          <Link
            href="/upcoming-events"
            className={`group inline-flex items-center gap-2 rounded-xl border bg-white/90 hover:bg-sky-500 hover:text-white hover:border-sky-500 px-7 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C6FF] dark:bg-[#131C3A]/90 dark:hover:bg-sky-500 dark:hover:text-white dark:hover:border-sky-500 shadow-md ${edge}`}
          >
            <span>View all community drives</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
