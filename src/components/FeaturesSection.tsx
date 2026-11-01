'use client';

// ==============================================================
// FeaturesSection Component
// Bento Grid Architecture with Interactive Demos:
// 1. Hyperlocal Map Demo (Slider radius filter with SVG map & dynamic pins)
// 2. Zero-Friction One-Click Join Demo (Interactive participant counter)
// 3. Transparent Accountability Timeline (IntersectionObserver animated progress line)
// ==============================================================

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Check,
  ShieldCheck,
  Camera,
  CalendarCheck,
  ArrowUpRight,
  Compass,
  MousePointerClick,
  BadgeCheck,
} from 'lucide-react';

const card =
  'relative overflow-hidden rounded-[1.75rem] border p-7 sm:p-8 transition-shadow duration-300 ' +
  'bg-white/80 border-[#D6F3FA] shadow-[0_10px_40px_-18px_rgba(0,120,200,0.35)] hover:shadow-[0_20px_50px_-15px_rgba(0,184,217,0.45)] ' +
  'dark:bg-[#131C3A]/80 dark:border-white/10 dark:shadow-none dark:hover:shadow-[0_0_44px_-10px_rgba(34,211,238,0.4)]';

const muted = 'text-[#35507A] dark:text-[#8EA0C4]';

/* ---------- 1. Hyperlocal map demo ---------- */
const PINS = [
  { km: 0.4, x: 60, y: 38, label: 'Park cleanup', c: '#2DE2C0' },
  { km: 1.2, x: 28, y: 68, label: 'Blood drive', c: '#FF6B9A' },
  { km: 2.2, x: 80, y: 74, label: 'Food packing', c: '#7B61FF' },
  { km: 2.8, x: 18, y: 20, label: 'Book fair', c: '#00B8D9' },
];

function MapDemo() {
  const [r, setR] = useState(1.5);
  const found = PINS.filter((p) => p.km <= r).length;
  return (
    <div>
      <div
        className="relative h-56 overflow-hidden rounded-2xl bg-[#E6F6FC] dark:bg-[#0D1A33]"
        role="img"
        aria-label={`Map showing ${found} drives within ${r} kilometres`}
      >
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full text-[#B9DDEB] dark:text-[#1C2750]"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <g stroke="currentColor" strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke">
            <path d="M0 30 Q40 20 100 38" />
            <path d="M0 72 Q50 60 100 80" />
            <path d="M24 0 Q34 50 20 100" />
            <path d="M66 0 Q56 45 72 100" />
            <path d="M0 50 L100 52" strokeWidth="0.8" />
          </g>
        </svg>
        {/* radius rings */}
        <div
          className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#00B8D9] bg-[#00B8D9]/10 transition-[width] duration-500"
          style={{ width: `${(r / 3) * 100}%` }}
        />
        {/* you */}
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="block h-4 w-4 rounded-full border-[3px] border-white bg-[#3B6CFF] shadow-lg" />
        </span>
        {PINS.map((p) => {
          const on = p.km <= r;
          return (
            <div
              key={p.label}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-500"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: on ? 1 : 0,
                transform: `translate(-50%,-50%) scale(${on ? 1 : 0.4})`,
              }}
            >
              <span className="whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0B2447] shadow-md">
                {p.label} · {p.km} km
              </span>
              <MapPin className="mt-0.5 h-5 w-5" style={{ color: p.c }} fill={p.c} fillOpacity={0.25} />
            </div>
          );
        })}
      </div>
      <label className="mt-5 block">
        <span className="flex items-center justify-between text-sm font-semibold">
          Distance from home{' '}
          <span className="text-[#00B8D9]">
            {r} km · {found} {found === 1 ? 'drive' : 'drives'}
          </span>
        </span>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={r}
          onChange={(e) => setR(+e.target.value)}
          className="mt-2 w-full accent-[#00B8D9]"
        />
      </label>
    </div>
  );
}

/* ---------- 2. One-click join demo ---------- */
function JoinDemo() {
  const [joined, setJoined] = useState(false);
  const count = 38 + (joined ? 1 : 0);
  return (
    <div className="rounded-2xl bg-[#F3F1FF] p-5 dark:bg-[#1C2750]">
      <p className="text-sm font-semibold">Riverside Cleanup · Sat, 8:00 AM</p>
      <p className={`mt-0.5 text-sm ${muted}`}>Hatirjheel, Dhaka</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {['#00B8D9', '#2DE2C0', '#FF6B9A'].map((c) => (
              <span
                key={c}
                className="h-8 w-8 rounded-full border-2 border-[#F3F1FF] dark:border-[#1C2750]"
                style={{ background: c }}
              />
            ))}
            {joined && (
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#F3F1FF] bg-[#7B61FF] text-xs font-bold text-white dark:border-[#1C2750]">
                You
              </span>
            )}
          </div>
          <span className="ml-3 text-sm font-semibold" aria-live="polite">
            {count} going
          </span>
        </div>
        <button
          onClick={() => setJoined((j) => !j)}
          aria-pressed={joined}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B61FF] ${
            joined
              ? 'bg-[#2DE2C0] text-[#06161C]'
              : 'bg-gradient-to-r from-[#3B6CFF] to-[#7B61FF] text-white hover:-translate-y-0.5'
          }`}
        >
          {joined ? (
            <>
              <Check className="h-4 w-4" /> You’re in
            </>
          ) : (
            <>
              <MousePointerClick className="h-4 w-4" /> Join drive
            </>
          )}
        </button>
      </div>
      <p className={`mt-3 text-xs ${muted}`}>
        {joined
          ? 'Added to your volunteer portfolio. Tap again to leave.'
          : 'One tap. No forms, no sign-up steps.'}
      </p>
    </div>
  );
}

/* ---------- 3. Accountability timeline ---------- */
const STEPS = [
  { Icon: BadgeCheck, t: 'Profile verified', d: 'ID and organisation checked' },
  { Icon: CalendarCheck, t: 'Plan published', d: 'Timeline and location tagged' },
  { Icon: Camera, t: 'Photo update posted', d: 'Proof shared after the drive' },
];

function Timeline() {
  const ref = useRef<HTMLOListElement | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <ol ref={ref} className="relative space-y-6">
      <span
        aria-hidden
        className="absolute left-[18px] -translate-x-1/2 top-[18px] h-[calc(100%-36px)] w-0.5 bg-[#D6F3FA] dark:bg-white/10"
      />
      <span
        aria-hidden
        className="absolute left-[18px] -translate-x-1/2 top-[18px] w-0.5 bg-gradient-to-b from-[#2DE2C0] to-[#00B8D9] transition-[height] duration-[1600ms] ease-out"
        style={{ height: seen ? 'calc(100% - 36px)' : '0%' }}
      />
      {STEPS.map(({ Icon, t, d }, i) => (
        <li key={t} className="relative flex items-center gap-4">
          <span
            className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2DE2C0] text-[#06161C] transition-transform duration-500 shadow-sm"
            style={{
              transform: seen ? 'scale(1)' : 'scale(0.6)',
              transitionDelay: `${i * 450}ms`,
            }}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold leading-tight">{t}</p>
            <p className={`text-sm ${muted}`}>{d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

interface CardLinkProps {
  href: string;
  children: React.ReactNode;
  color: string;
}

function CardLink({ href, children, color }: CardLinkProps) {
  return (
    <Link
      href={href}
      className="group mt-6 inline-flex items-center gap-1.5 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ color }}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-[#EAF6FF] py-20 text-[#0B2447] dark:bg-[#0A1128] dark:text-[#E8F0FF] sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-[#00C6FF]/25 blur-[100px] dark:bg-[#22D3EE]/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#7B61FF]/20 blur-[110px] dark:bg-[#8B7BFF]/15"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
          <h2 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0B2447] dark:text-[#E8F0FF] sm:text-5xl">
            Built for the way
            <br />
            neighbours{' '}
            <span className="bg-gradient-to-r from-[#3B6CFF] via-[#00B8D9] to-[#7B61FF] bg-clip-text text-transparent">
              actually help each other.
            </span>
          </h2>
          <p className={`max-w-md text-lg leading-relaxed lg:justify-self-end ${muted}`}>
            Find a drive on your street, join in one tap, and see exactly where every effort went. Try the demos below.
          </p>
        </div>

        {/* bento */}
        <div className="mt-14 grid gap-6 lg:grid-cols-6">
          {/* 1 */}
          <article className={`${card} lg:col-span-3`}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#D6F3FA] text-[#0E7490] dark:bg-[#22D3EE]/15 dark:text-[#22D3EE]">
                <Compass className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold">Hyperlocal discovery</h3>
            </div>
            <MapDemo />
            <p className={`mt-5 leading-relaxed ${muted}`}>
              Filter drives by your exact neighbourhood and meet volunteers within walking distance of home.
            </p>
            <CardLink href="/upcoming-events" color="#00B8D9">
              Browse by location
            </CardLink>
          </article>

          {/* 2 */}
          <article className={`${card} lg:col-span-3`}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#E3E8FF] text-[#5B45E6] dark:bg-[#8B7BFF]/20 dark:text-[#B3A8FF]">
                <MousePointerClick className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold">Zero-friction joining</h3>
            </div>
            <JoinDemo />
            <p className={`mt-5 leading-relaxed ${muted}`}>
              Join any upcoming drive with a single click, keep your volunteer portfolio, and talk directly to event leaders.
            </p>
            <CardLink href="/upcoming-events" color="#7B61FF">
              Join a drive now
            </CardLink>
          </article>

          {/* 3 */}
          <article className={`${card} lg:col-span-6`}>
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#D9F7F2] text-[#0F9D82] dark:bg-[#2DE2C0]/15 dark:text-[#2DE2C0]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold">Transparent accountability</h3>
                </div>
                <p className={`max-w-md text-lg leading-relaxed ${muted}`}>
                  Organisers link verified profiles with clear timelines, location tags and post-drive photo updates, so trust is something you can check.
                </p>
                <CardLink href="/upcoming-events" color="#0F9D82">
                  See verified campaigns
                </CardLink>
              </div>
              <div className="rounded-2xl bg-[#F0FBF8] p-6 dark:bg-[#0D262F]">
                <Timeline />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
