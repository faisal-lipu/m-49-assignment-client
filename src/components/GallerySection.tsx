'use client';

// ==============================================================
// GallerySection Component
// Expanding accordion panel gallery with interactive hover/focus states,
// impact metric chips, soft accent gradients, and mobile accordion support.
// ==============================================================

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Hand } from 'lucide-react';

export interface GalleryStory {
  src: string;
  alt: string;
  tag: string;
  title: string;
  caption: string;
  value: string;
  unit: string;
  color: string;
}

/* আমাদের পূর্বের চারটি ইউনিক ও আনস্প্ল্যাশ ছবির লিঙ্ক দিয়ে প্রতিস্থাপিত */
export const DEFAULT_STORIES: GalleryStory[] = [
  {
    src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    alt: 'Hands holding a young fern and soil',
    tag: 'Environmental drive',
    title: 'Urban Tree Planting',
    caption: 'Neighbours brought a bare corner of the city back to life, one sapling at a time.',
    value: '800+',
    unit: 'saplings planted',
    color: '#2DE2C0',
  },
  {
    src: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&q=80&w=1200',
    alt: 'Two children receiving winter clothes',
    tag: 'Winter warmth',
    title: 'Blanket & Clothes Distribution',
    caption: 'Volunteers went door to door before the first cold nights reached the old city.',
    value: '3,200',
    unit: 'blankets delivered',
    color: '#B3A8FF',
  },
  {
    src: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1200',
    alt: 'Colour-coded waste bins in a row',
    tag: 'Clean cities',
    title: 'Neighborhood Waste Cleanup',
    caption: 'One weekend, one street, and a sorting system the whole block now follows.',
    value: '12 tons',
    unit: 'waste collected',
    color: '#22D3EE',
  },
  {
    src: 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&q=80&w=1200',
    alt: 'Two hands reaching out to each other',
    tag: 'Food security',
    title: 'Emergency Ration Packing',
    caption: 'Hundreds of hands packed relief boxes in a single day for families in need.',
    value: '5,000',
    unit: 'meals packed',
    color: '#7DA2FF',
  },
];

interface GallerySectionProps {
  stories?: GalleryStory[];
}

export default function GallerySection({ stories = DEFAULT_STORIES }: GallerySectionProps) {
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#EAF6FF] py-20 text-[#0B2447] dark:bg-[#0A1128] dark:text-[#E8F0FF] sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#7B61FF]/20 blur-[110px] dark:bg-[#8B7BFF]/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#00C6FF]/25 blur-[100px] dark:bg-[#22D3EE]/10"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0B2447] dark:text-[#E8F0FF] sm:text-5xl">
              Real people.
              <br />
              <span className="bg-gradient-to-r from-[#3B6CFF] via-[#00B8D9] to-[#7B61FF] bg-clip-text text-transparent">
                Real change on the ground.
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-[#35507A] dark:text-[#8EA0C4]">
              Moments captured during volunteer distributions and environmental campaigns across the city.
            </p>
          </div>
          <p className="hidden items-center gap-2 rounded-full border border-[#D6F3FA] bg-white/70 px-4 py-2 text-sm font-medium dark:border-white/10 dark:bg-[#131C3A]/70 lg:inline-flex">
            <Hand className="h-4 w-4 text-[#00B8D9]" /> Hover a photo to read its story
          </p>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#D6F3FA] bg-white/70 px-4 py-2 text-sm font-medium dark:border-white/10 dark:bg-[#131C3A]/70 lg:hidden">
            <Hand className="h-4 w-4 text-[#00B8D9]" /> Tap a photo to read its story
          </p>
        </div>

        {/* expanding panels: row on desktop, column on mobile */}
        <ul className="mt-12 flex h-[38rem] flex-col gap-3 sm:h-[34rem] lg:flex-row lg:gap-4">
          {stories.map((s, i) => {
            const on = i === active;
            return (
              <li
                key={s.title}
                tabIndex={0}
                aria-label={`${s.title}. ${on ? 'Expanded' : 'Press Enter to expand'}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/60 shadow-[0_18px_40px_-20px_rgba(11,36,71,0.6)] outline-none transition-[flex-grow] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] focus-visible:ring-4 focus-visible:ring-[#00C6FF] dark:border-white/10"
                style={{ flexGrow: on ? 4 : 1, flexBasis: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.alt}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                    on ? 'scale-100 brightness-100' : 'scale-110 brightness-[0.65] saturate-75'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/90 via-[#0A1128]/20 to-transparent" />
                {/* colour wash tied to the story's accent */}
                <div
                  className="absolute inset-0 mix-blend-soft-light transition-opacity duration-700"
                  style={{
                    background: `linear-gradient(160deg, ${s.color}, transparent 60%)`,
                    opacity: on ? 0 : 0.7,
                  }}
                />

                {/* collapsed label */}
                <div
                  className={`absolute inset-0 flex items-end p-5 transition-opacity duration-300 lg:items-end lg:justify-center lg:pb-7 ${
                    on ? 'pointer-events-none opacity-0' : 'opacity-100 delay-300'
                  }`}
                >
                  <span className="flex items-center gap-3 text-white lg:[writing-mode:vertical-rl] lg:rotate-180">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                    <span className="truncate text-base font-bold">{s.title}</span>
                  </span>
                </div>

                {/* impact chip */}
                <div
                  className={`absolute right-4 top-4 rounded-2xl border border-white/30 bg-white/15 px-4 py-2.5 text-white backdrop-blur-xl transition-all duration-500 ${
                    on ? 'translate-y-0 opacity-100 delay-300' : '-translate-y-2 opacity-0'
                  }`}
                >
                  <p className="text-2xl font-extrabold leading-none">{s.value}</p>
                  <p className="mt-1 text-xs text-white/80">{s.unit}</p>
                </div>

                {/* expanded story */}
                <div
                  className={`absolute bottom-0 left-0 w-full p-6 text-white transition-all duration-500 sm:p-8 lg:w-[26rem] ${
                    on ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-4 opacity-0'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-xs font-bold backdrop-blur">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.tag}
                  </span>
                  <h3 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">{s.caption}</p>
                  <Link
                    href="/upcoming-events"
                    tabIndex={on ? 0 : -1}
                    className="group/link mt-4 inline-flex items-center gap-1.5 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    style={{ color: s.color }}
                  >
                    Join a drive like this
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
