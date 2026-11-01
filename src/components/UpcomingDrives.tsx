'use client';

// ==============================================================
// UpcomingDrives Component
// Ticket-style event cards with perforation notches, date blocks,
// progress indicators, and an interactive empty state.
// ==============================================================

import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarPlus,
  MapPin,
  Clock,
  Plus,
  MapPinned,
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
}

/* টেস্ট করতে চাইলে: <UpcomingDrives events={SAMPLE_EVENTS} /> */
export const SAMPLE_EVENTS: DriveEvent[] = [
  {
    id: '1',
    title: 'Riverside Cleanup Day',
    category: 'environment',
    date: '2026-11-07T08:00:00',
    location: 'Hatirjheel, Dhaka',
    joined: 24,
    capacity: 40,
  },
  {
    id: '2',
    title: 'Winter Clothes Donation Drive',
    category: 'community',
    date: '2026-11-14T10:00:00',
    location: 'Mirpur 10, Dhaka',
    joined: 31,
    capacity: 50,
  },
  {
    id: '3',
    title: 'Free Health Check-up Camp',
    category: 'health',
    date: '2026-11-21T09:30:00',
    location: 'Dhanmondi, Dhaka',
    joined: 9,
    capacity: 30,
  },
];

const CAT: Record<string, { c: string; tint: string; label: string }> = {
  education: { c: '#7B61FF', tint: 'rgba(123,97,255,0.14)', label: 'Education' },
  health: { c: '#10B981', tint: 'rgba(16,185,129,0.14)', label: 'Health' },
  environment: { c: '#0891B2', tint: 'rgba(8,145,178,0.14)', label: 'Environment' },
  community: { c: '#3B6CFF', tint: 'rgba(59,108,255,0.14)', label: 'Community' },
  donation: { c: '#3B6CFF', tint: 'rgba(59,108,255,0.14)', label: 'Donation' },
  cleanup: { c: '#0891B2', tint: 'rgba(8,145,178,0.14)', label: 'Cleanup' },
  plantation: { c: '#10B981', tint: 'rgba(16,185,129,0.14)', label: 'Plantation' },
  'food relief': { c: '#FF6B9A', tint: 'rgba(255,107,154,0.14)', label: 'Food Relief' },
  healthcare: { c: '#10B981', tint: 'rgba(16,185,129,0.14)', label: 'Healthcare' },
  'animal welfare': { c: '#F59E0B', tint: 'rgba(245,158,11,0.14)', label: 'Animal Welfare' },
};

const SECTION_BG = 'bg-[#F2FBFF] dark:bg-[#0A1128]';
const muted = 'text-[#35507A] dark:text-[#8EA0C4]';
const edge = 'border-[#D6F3FA] dark:border-white/10';

interface TicketProps {
  ev?: DriveEvent;
  ghost?: boolean;
}

/* ---------- ticket card ---------- */
function Ticket({ ev, ghost = false }: TicketProps) {
  const catKey = (ev?.category || ev?.eventType || 'community').toLowerCase();
  const cat = CAT[catKey] ?? CAT.community;

  const rawDate = ev?.date || ev?.eventDate;
  const d = rawDate ? new Date(rawDate) : new Date();

  const joinedCount = ev?.joined ?? 18;
  const totalCapacity = ev?.capacity ?? 40;
  const pct = Math.min(100, Math.round((joinedCount / totalCapacity) * 100));
  const left = Math.max(0, totalCapacity - joinedCount);
  const eventId = ev?.id || ev?._id || '1';

  const notch = `absolute top-[-12px] h-6 w-6 rounded-full border ${edge} ${SECTION_BG}`;

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border bg-white transition duration-300 dark:bg-[#131C3A] ${edge} ${
        ghost
          ? 'border-2 border-dashed border-[#00B8D9]/50 bg-white/60 dark:border-[#22D3EE]/40 dark:bg-[#131C3A]/60'
          : 'shadow-[0_12px_36px_-18px_rgba(0,120,200,0.4)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(0,184,217,0.5)] dark:shadow-none dark:hover:shadow-[0_0_44px_-10px_rgba(34,211,238,0.4)]'
      }`}
      aria-hidden={ghost || undefined}
    >
      {/* top: date + title */}
      <div className="flex gap-4 p-6">
        {ghost ? (
          <div className="grid h-[4.5rem] w-16 shrink-0 place-items-center rounded-2xl bg-[#D6F3FA] dark:bg-[#22D3EE]/15">
            <Plus className="mt-pulse h-7 w-7 text-[#00B8D9]" />
          </div>
        ) : (
          <div
            className="flex h-[4.5rem] w-16 shrink-0 flex-col items-center justify-center rounded-2xl"
            style={{ background: cat.tint, color: cat.c }}
          >
            <span className="text-xs font-semibold">
              {d.toLocaleDateString('en-GB', { weekday: 'short' })}
            </span>
            <span className="text-3xl font-extrabold leading-none">{d.getDate()}</span>
            <span className="text-xs font-semibold">
              {d.toLocaleDateString('en-GB', { month: 'short' })}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          {ghost ? (
            <>
              <div className="h-5 w-24 rounded-full bg-[#D6F3FA] dark:bg-white/10" />
              <p className="mt-3 text-lg font-bold">Your event could be here</p>
            </>
          ) : (
            <>
              <span
                className="inline-flex rounded-full px-2.5 py-1 text-xs font-bold"
                style={{ background: cat.tint, color: cat.c }}
              >
                {cat.label}
              </span>
              <h3 className="mt-2 text-lg font-bold leading-snug line-clamp-1">{ev?.title}</h3>
            </>
          )}
        </div>
      </div>

      {/* meta */}
      <div className={`space-y-2 px-6 pb-6 text-sm ${muted}`}>
        {ghost ? (
          <>
            <div className="h-3 w-3/4 rounded-full bg-[#D6F3FA] dark:bg-white/10" />
            <div className="h-3 w-1/2 rounded-full bg-[#D6F3FA] dark:bg-white/10" />
          </>
        ) : (
          <>
            <p className="flex items-center gap-2 truncate">
              <MapPin className="h-4 w-4 shrink-0" style={{ color: cat.c }} />
              <span className="truncate">{ev?.location}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" style={{ color: cat.c }} />
              <span>
                {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </p>
          </>
        )}
      </div>

      {/* perforation */}
      <div className="relative">
        <span className={`${notch} -left-3`} />
        <span className={`${notch} -right-3`} />
        <div className={`mx-6 border-t-2 border-dashed ${edge}`} />
      </div>

      {/* bottom: progress + join */}
      <div className="p-6">
        {ghost ? (
          <div className="h-10 rounded-xl bg-[#D6F3FA] dark:bg-white/10" />
        ) : (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-semibold">
                <Users className="h-4 w-4" style={{ color: cat.c }} />
                {joinedCount} joined
              </span>
              <span className={muted}>{left > 0 ? `${left} spots left` : 'Full'}</span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-[#E6F2F8] dark:bg-white/10"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Volunteer spots filled"
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${cat.c}, #00C6FF)`,
                }}
              />
            </div>
            <Link
              href={`/events/${eventId}`}
              className="group mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#0B2447] py-3 text-sm font-bold text-white transition hover:bg-gradient-to-r hover:from-[#3B6CFF] hover:to-[#7B61FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C6FF] dark:bg-[#22D3EE] dark:text-[#0A1128] dark:hover:text-white"
            >
              View and join
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </>
        )}
      </div>
    </article>
  );
}

/* ---------- empty state ---------- */
const STEPS = ['Add the details', 'Pin the location', 'Invite volunteers'];

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-[#00B8D9]/40 bg-gradient-to-br from-white/80 to-[#D6F3FA]/70 p-8 dark:border-[#22D3EE]/30 dark:from-[#131C3A]/80 dark:to-[#0D262F]/70 sm:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#7B61FF]/20 blur-[90px] dark:bg-[#8B7BFF]/20"
      />
      <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h3 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            No drives scheduled yet.
            <br />
            <span className="bg-gradient-to-r from-[#3B6CFF] via-[#00B8D9] to-[#7B61FF] bg-clip-text text-transparent">
              Yours could be the first.
            </span>
          </h3>
          <p className={`mt-4 max-w-lg text-lg leading-relaxed ${muted}`}>
            Every big change in a neighbourhood began with one person posting one event. Start yours and let your city show up.
          </p>

          <ol className="mt-7 flex flex-wrap gap-3">
            {STEPS.map((s, i) => (
              <li
                key={s}
                className={`flex items-center gap-2.5 rounded-full border bg-white/70 py-1.5 pl-1.5 pr-4 text-sm font-semibold dark:bg-[#131C3A]/70 ${edge}`}
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#00C6FF] to-[#3B6CFF] text-xs font-bold text-white">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>

          <Link
            href="/create-event"
            className="group mt-9 inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#3B6CFF] to-[#7B61FF] px-7 py-4 font-bold text-white shadow-[0_12px_30px_-8px_rgba(59,108,255,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-6px_rgba(123,97,255,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00C6FF]"
          >
            <CalendarPlus className="h-5 w-5" />
            Create the first event
          </Link>
        </div>

        {/* ghost ticket preview */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="mt-float -rotate-2">
            <Ticket ghost />
          </div>
          <span
            className="mt-float2 absolute -right-3 -top-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#2DE2C0] text-[#06161C] shadow-lg"
            aria-hidden
          >
            <MapPinned className="h-6 w-6" />
          </span>
          <span
            className="mt-float absolute -bottom-4 -left-4 rounded-full bg-[#FF6B9A] px-3.5 py-1.5 text-xs font-bold text-white shadow-lg"
            style={{ animationDelay: '-3s' }}
            aria-hidden
          >
            Takes about 2 minutes
          </span>
        </div>
      </div>
    </div>
  );
}

interface UpcomingDrivesProps {
  events?: DriveEvent[];
}

/* ---------- section ---------- */
export default function UpcomingDrives({ events = [] }: UpcomingDrivesProps) {
  const shown = events.slice(0, 6);
  const has = shown.length > 0;

  return (
    <section className={`relative overflow-hidden py-20 text-[#0B2447] dark:text-[#E8F0FF] sm:py-28 ${SECTION_BG}`}>
      <style>{`
        @keyframes mt-float{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-12px) rotate(var(--r,0deg))}}
        @keyframes mt-float2{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}
        @keyframes mt-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}
        .mt-float{animation:mt-float 6s ease-in-out infinite}
        .mt-float2{animation:mt-float2 7s ease-in-out infinite}
        .mt-pulse{animation:mt-pulse 2s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){.mt-float,.mt-float2,.mt-pulse{animation:none}}
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#00C6FF]/20 blur-[100px] dark:bg-[#22D3EE]/10"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p
              className={`mb-3 inline-flex items-center gap-2 rounded-full border bg-white/70 px-3.5 py-1.5 text-sm font-medium dark:bg-[#131C3A]/70 ${edge}`}
            >
              <span className={`h-2 w-2 rounded-full ${has ? 'bg-[#2DE2C0]' : 'bg-[#FFB020]'}`} />
              {has
                ? `${events.length} ${events.length === 1 ? 'drive' : 'drives'} open for volunteers`
                : 'Waiting for the first drive'}
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#0B2447] dark:text-[#E8F0FF] sm:text-5xl">
              Next in line in your city
            </h2>
            <p className={`mt-3 max-w-xl text-lg ${muted}`}>
              Scheduled social events that need volunteers like you.
            </p>
          </div>
          <Link
            href="/upcoming-events"
            className={`group inline-flex items-center gap-2 rounded-xl border bg-white/80 px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[#00B8D9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C6FF] dark:bg-[#131C3A]/80 ${edge}`}
          >
            View all events
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-12">
          {has ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((ev, index) => (
                <Ticket key={ev.id || ev._id || index} ev={ev} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  );
}
