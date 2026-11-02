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

/* Verified unique Unsplash community photos showcasing grassroots volunteer initiatives */
export const DEFAULT_STORIES: GalleryStory[] = [
  {
    src: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&q=80&w=1200',
    alt: 'Community volunteers planting indigenous tree saplings',
    tag: 'Environmental drive',
    title: 'Urban Tree Planting',
    caption: 'Neighbours brought a bare corner of the city back to life, one sapling at a time.',
    value: '800+',
    unit: 'saplings planted',
    color: '#2DE2C0',
  },
  {
    src: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=1200',
    alt: 'Volunteers packing winter warmth packages and clothes',
    tag: 'Winter warmth',
    title: 'Blanket & Clothes Distribution',
    caption: 'Volunteers went door to door before the first cold nights reached the old city.',
    value: '3,200',
    unit: 'blankets delivered',
    color: '#B3A8FF',
  },
  {
    src: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=1200',
    alt: 'Youth volunteers collecting and recycling neighborhood plastic waste',
    tag: 'Clean cities',
    title: 'Neighborhood Waste Cleanup',
    caption: 'One weekend, one street, and a sorting system the whole block now follows.',
    value: '12 tons',
    unit: 'waste collected',
    color: '#22D3EE',
  },
  {
    src: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&q=80&w=1200',
    alt: 'Fresh nutritious meals and food distribution drive',
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
    <section id="gallery" className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-center overflow-hidden bg-[#EAF6FF] py-10 lg:py-14 text-[#0B2447] dark:bg-[#0A1128] dark:text-[#E8F0FF] scroll-mt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#7B61FF]/20 blur-[110px] dark:bg-[#8B7BFF]/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#00C6FF]/25 blur-[100px] dark:bg-[#22D3EE]/10"
      />

      <div className="relative mx-auto pro-container">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[#0B2447] dark:text-[#E8F0FF] sm:text-3xl lg:text-4xl xl:text-[40px] lg:whitespace-nowrap">
            Real people.{' '}
            <span className="bg-gradient-to-r from-[#3B6CFF] via-[#00B8D9] to-[#7B61FF] bg-clip-text text-transparent">
              Real change on the ground.
            </span>
          </h2>
          <p className="mt-2.5 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed text-[#35507A] dark:text-[#8EA0C4]">
            Moments captured during volunteer distributions and environmental campaigns across the city.
          </p>
          <div className="mt-3.5 flex justify-center">
            <span className="hidden items-center gap-2 rounded-full border border-[#D6F3FA] bg-white/70 px-3.5 py-1.5 text-xs sm:text-sm font-medium dark:border-white/10 dark:bg-[#131C3A]/70 lg:inline-flex">
              <Hand className="h-4 w-4 text-[#00B8D9]" /> Hover a photo to read its story
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D6F3FA] bg-white/70 px-3.5 py-1.5 text-xs sm:text-sm font-medium dark:border-white/10 dark:bg-[#131C3A]/70 lg:hidden">
              <Hand className="h-4 w-4 text-[#00B8D9]" /> Tap a photo to read its story
            </span>
          </div>
        </div>

        {/* expanding panels: row on desktop, column on mobile */}
        <ul className="mt-8 flex h-[28rem] sm:h-[30rem] lg:h-[32rem] flex-col gap-3 lg:flex-row lg:gap-4">
          {stories.map((s, i) => {
            const on = i === active;
            return (
              <li
                key={s.title}
                tabIndex={0}
                aria-label={`${s.title}. ${on ? 'Expanded' : 'Press Enter to expand'}`}
                onMouseEnter={() => setActive(i)}
                onMouseMove={() => setActive(i)}
                onPointerEnter={() => setActive(i)}
                onPointerOver={() => setActive(i)}
                onPointerDown={() => setActive(i)}
                onTouchStart={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/60 hover:border-sky-400 shadow-[0_18px_40px_-20px_rgba(11,36,71,0.6)] hover:shadow-[0_20px_45px_-15px_rgba(34,211,238,0.45)] outline-none transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)] focus-visible:ring-4 focus-visible:ring-[#00C6FF] dark:border-white/10 dark:hover:border-[#22D3EE] ${
                  on ? 'ring-2 ring-sky-400/30' : 'hover:brightness-105'
                }`}
                style={{ flexGrow: on ? 4 : 1, flexBasis: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.alt}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                    on ? 'scale-100 brightness-100' : 'scale-110 brightness-[0.7] saturate-75 group-hover:brightness-90'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/95 via-[#0A1128]/30 to-transparent" />
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
                  className={`absolute inset-0 flex items-center px-4 py-2 sm:px-6 transition-opacity duration-300 lg:items-end lg:justify-center lg:pb-7 ${
                    on ? 'pointer-events-none opacity-0' : 'opacity-100 delay-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5 sm:gap-3 text-white group-hover:text-sky-300 transition-colors lg:[writing-mode:vertical-rl] lg:rotate-180">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full group-hover:scale-125 transition-transform" style={{ background: s.color }} />
                    <span className="truncate text-sm sm:text-base font-bold drop-shadow-sm">{s.title}</span>
                  </span>
                </div>

                {/* impact chip */}
                <div
                  className={`absolute right-3 top-3 sm:right-4 sm:top-4 rounded-xl sm:rounded-2xl border border-white/30 bg-white/15 px-3 py-1.5 sm:px-4 sm:py-2.5 text-white backdrop-blur-xl transition-all duration-500 ${
                    on ? 'translate-y-0 opacity-100 delay-300' : '-translate-y-2 opacity-0'
                  }`}
                >
                  <p className="text-xl sm:text-2xl font-extrabold leading-none">{s.value}</p>
                  <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-white/80">{s.unit}</p>
                </div>

                {/* expanded story */}
                <div
                  className={`absolute bottom-0 left-0 w-full p-4 sm:p-6 lg:p-8 text-white transition-all duration-500 lg:w-[26rem] ${
                    on ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-4 opacity-0'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/40 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold backdrop-blur border border-white/15">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.tag}
                  </span>
                  <h3 className="mt-2 sm:mt-3 text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight text-white !text-white drop-shadow-md">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm lg:text-base leading-relaxed text-white/90 drop-shadow-xs line-clamp-2 sm:line-clamp-none">
                    {s.caption}
                  </p>
                  <Link
                    href="/upcoming-events"
                    tabIndex={on ? 0 : -1}
                    className="group/link mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#0B2447] px-4 py-2 text-xs sm:text-sm font-bold backdrop-blur-md transition-all duration-200 border border-white/30 hover:border-white shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>Join a drive like this</span>
                    <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
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
