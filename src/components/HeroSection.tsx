"use client";

// ==============================================================
// HeroSection Component
// Animated Aurora & Glassmorphic Hero with Live Count-Up Metrics
// Layered Composition with 3D Depth, Floating Badges & Ambient Glows
// ==============================================================

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  HandHeart,
  ShieldCheck,
  BadgeCheck,
  MapPin,
  GraduationCap,
  Stethoscope,
  Leaf,
  Users,
  Sparkles,
} from "lucide-react";

/* ---------- count-up when visible ---------- */
function useCountUp(
  target: number,
  duration = 1800
): [number, React.RefObject<HTMLDivElement | null>] {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / duration, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return [value, ref];
}

const glass =
  "backdrop-blur-xl border bg-white/70 border-white/70 shadow-[0_10px_40px_-10px_rgba(0,120,200,0.35)] " +
  "dark:bg-[#131C3A]/70 dark:border-white/10 dark:shadow-[0_0_40px_-8px_rgba(34,211,238,0.35)]";

const AVATARS = ["#00B8D9", "#7B61FF", "#2DE2C0", "#FF6B9A"];

interface HeroSectionProps {
  image?: string;
}

export default function HeroSection({
  image = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1200",
}: HeroSectionProps) {
  const [families, familiesRef] = useCountUp(1250);
  const [volunteers, volunteersRef] = useCountUp(2400);

  return (
    <section className="relative overflow-hidden bg-[#F2FBFF] text-[#0B2447] dark:bg-[#0A1128] dark:text-[#E8F0FF] transition-colors">
      <style>{`
        @keyframes mt-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes mt-float2  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(12px)} }
        @keyframes mt-spin    { to{transform:rotate(360deg)} }
        @keyframes mt-flow    { to{stroke-dashoffset:-60} }
        @keyframes mt-shift   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes mt-ping    { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.6);opacity:0} }
        @keyframes mt-blob    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-30px) scale(1.12)} }
        @keyframes mt-rise    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        .mt-float{animation:mt-float 6s ease-in-out infinite}
        .mt-float2{animation:mt-float2 7s ease-in-out infinite}
        .mt-spin{animation:mt-spin 40s linear infinite}
        .mt-flow{animation:mt-flow 3s linear infinite}
        .mt-grad{background-size:220% 220%;animation:mt-shift 6s ease infinite}
        .mt-ping{animation:mt-ping 1.8s ease-out infinite}
        .mt-blob{animation:mt-blob 14s ease-in-out infinite}
        .mt-rise{animation:mt-rise .9s cubic-bezier(.2,.7,.2,1) both}
        @media (prefers-reduced-motion: reduce){
          .mt-float,.mt-float2,.mt-spin,.mt-flow,.mt-grad,.mt-ping,.mt-blob,.mt-rise{animation:none}
        }
      `}</style>

      {/* ---------- aurora background ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="mt-blob absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[#00C6FF]/40 blur-[100px] dark:bg-[#22D3EE]/25" />
        <div
          className="mt-blob absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#7B61FF]/30 blur-[110px] dark:bg-[#8B7BFF]/25"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="mt-blob absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#2DE2C0]/30 blur-[100px] dark:bg-[#2DE2C0]/15"
          style={{ animationDelay: "-9s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
          style={{
            backgroundImage: "radial-gradient(circle, #3B6CFF 1px, transparent 1.4px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at 70% 40%, #000 10%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 70% 40%, #000 10%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        {/* ================= LEFT ================= */}
        <div>
          <div
            className={`mt-rise inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-sm font-medium text-[#0B2447] dark:text-[#E8F0FF] ${glass}`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="mt-ping absolute inline-flex h-full w-full rounded-full bg-[#2DE2C0]" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2DE2C0]" />
            </span>
            Active social initiatives across Dhaka
          </div>

          <h1
            className="mt-rise mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-[#0B2447] dark:text-[#E8F0FF] sm:text-6xl xl:text-7xl"
            style={{ animationDelay: ".1s" }}
          >
            Bridging Compassion,
            <span className="relative block">
              <span className="mt-grad bg-gradient-to-r from-[#3B6CFF] via-[#00C6FF] to-[#7B61FF] bg-clip-text text-transparent">
                Inspiring Change.
              </span>
              <svg
                aria-hidden
                viewBox="0 0 320 14"
                className="absolute -bottom-2 left-0 h-3 w-2/3 text-[#00C6FF]"
                fill="none"
              >
                <path
                  d="M2 9C50 2 90 13 140 7S250 3 318 8"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p
            className="mt-rise mt-8 max-w-xl text-lg leading-relaxed text-[#35507A] dark:text-[#8EA0C4]"
            style={{ animationDelay: ".2s" }}
          >
            Maitri is a citizen-first social service hub. Find donation drives near you, join a
            neighborhood cleanup, or launch your own campaign with every taka accounted for.
          </p>

          <div
            className="mt-rise mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: ".3s" }}
          >
            <Link
              href="/upcoming-events"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#3B6CFF] to-[#7B61FF] px-7 py-4 font-semibold text-white shadow-[0_12px_30px_-8px_rgba(59,108,255,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-6px_rgba(123,97,255,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00C6FF]"
            >
              Explore drives
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/create-event"
              className={`inline-flex items-center gap-2 rounded-2xl px-7 py-4 font-semibold text-[#0B2447] dark:text-[#E8F0FF] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00C6FF] ${glass}`}
            >
              <HandHeart className="h-5 w-5 text-[#00B8D9]" />
              Start an initiative
            </Link>
          </div>

          {/* trust row */}
          <ul
            className="mt-rise mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#35507A] dark:text-[#8EA0C4]"
            style={{ animationDelay: ".4s" }}
          >
            {[
              [BadgeCheck, "Free and open to everyone"],
              [ShieldCheck, "Verified coordinators"],
              [Sparkles, "No administrative fees"],
            ].map(([Icon, label]) => {
              const IconComp = Icon as any;
              return (
                <li key={label as string} className="flex items-center gap-2">
                  <IconComp className="h-4 w-4 text-[#00B8D9]" />
                  {label as string}
                </li>
              );
            })}
          </ul>
        </div>

        {/* ================= RIGHT: layered composition ================= */}
        <div className="relative mx-auto h-[520px] w-full max-w-[540px] sm:h-[580px]">
          {/* rotating dashed ring */}
          <svg
            aria-hidden
            viewBox="0 0 400 400"
            className="mt-spin absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 text-[#3B6CFF]/30 dark:text-[#22D3EE]/30"
          >
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 10"
              strokeLinecap="round"
            />
          </svg>

          {/* back card (gradient) */}
          <div className="absolute inset-x-8 top-8 bottom-10 -rotate-6 rounded-[2.2rem] bg-gradient-to-br from-[#00C6FF] via-[#3B6CFF] to-[#7B61FF] opacity-90 shadow-2xl" />

          {/* main image card */}
          <figure className="group absolute inset-x-6 top-4 bottom-14 rotate-3 overflow-hidden rounded-[2.2rem] border-4 border-white shadow-[0_30px_60px_-20px_rgba(11,36,71,0.6)] transition-transform duration-500 hover:rotate-0 dark:border-[#1C2750]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Maitri volunteer photographing a community drive in Dhaka"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/90 via-[#0A1128]/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2DE2C0] px-3 py-1 text-xs font-bold text-[#06161C]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#06161C]" /> Ongoing drive
              </span>
              <p className="mt-3 text-2xl font-bold">Winter Clothes Donation Drive</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                <MapPin className="h-4 w-4" /> Mirpur, Dhaka
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="mt-grad h-full w-[72%] rounded-full bg-gradient-to-r from-[#2DE2C0] via-[#00C6FF] to-[#7B61FF]" />
              </div>
              <p className="mt-1.5 text-xs text-white/70">72% of the goal reached</p>
            </figcaption>
          </figure>

          {/* thread connecting the floating cards (Maitri = bond) */}
          <svg
            aria-hidden
            viewBox="0 0 540 580"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <path
              className="mt-flow"
              d="M70 90 C 20 230, 140 300, 100 470"
              fill="none"
              stroke="#00C6FF"
              strokeWidth="2.5"
              strokeDasharray="6 10"
              strokeLinecap="round"
            />
            <path
              className="mt-flow"
              d="M470 130 C 560 260, 430 340, 470 440"
              fill="none"
              stroke="#7B61FF"
              strokeWidth="2.5"
              strokeDasharray="6 10"
              strokeLinecap="round"
            />
          </svg>

          {/* floating: community goal */}
          <div
            ref={familiesRef}
            className={`mt-float absolute -left-2 top-2 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-8 ${glass}`}
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#00C6FF] to-[#3B6CFF] text-white">
              <HandHeart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-[#35507A] dark:text-[#8EA0C4]">Community goal</p>
              <p className="text-lg font-extrabold leading-tight text-[#0B2447] dark:text-[#E8F0FF]">
                {families.toLocaleString()}+ families supported
              </p>
            </div>
          </div>

          {/* floating: volunteers */}
          <div
            ref={volunteersRef}
            className={`mt-float2 absolute -right-2 top-[44%] rounded-2xl px-4 py-3 sm:-right-8 ${glass}`}
          >
            <div className="flex -space-x-2.5">
              {AVATARS.map((c, i) => (
                <span
                  key={c}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-white text-xs font-bold text-white dark:border-[#131C3A]"
                  style={{ background: c }}
                >
                  {["R", "S", "A", "N"][i]}
                </span>
              ))}
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#E3E8FF] text-xs font-bold text-[#3B6CFF] dark:border-[#131C3A] dark:bg-[#1C2750] dark:text-[#22D3EE]">
                <Users className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-sm font-bold text-[#0B2447] dark:text-[#E8F0FF]">
              {volunteers.toLocaleString()}+ active volunteers
            </p>
          </div>

          {/* floating: category chips */}
          <div
            className="mt-float absolute -bottom-1 left-2 flex flex-wrap gap-2 sm:left-4"
            style={{ animationDelay: "-2s" }}
          >
            {[
              [GraduationCap, "Education", "#7B61FF"],
              [Stethoscope, "Health", "#10B981"],
              [Leaf, "Environment", "#0891B2"],
            ].map(([Icon, label, c]) => {
              const IconComp = Icon as any;
              return (
                <span
                  key={label as string}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold ${glass}`}
                >
                  <IconComp className="h-3.5 w-3.5" style={{ color: c as string }} />
                  {label as string}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
