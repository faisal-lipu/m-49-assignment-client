'use client';

// ==============================================================
// SectionNavigator Component
// Floating 1-click Quick Navigation Dock for Homepage Sections
// Features:
// - Up/Down 1-click step buttons
// - Interactive glowing dot indicators with hover labels
// - Live IntersectionObserver active section tracking
// - Smooth viewport alignment
// ==============================================================

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SectionItem {
  id: string;
  label: string;
  shortLabel: string;
  iconSrc: string;
}

const SECTIONS: SectionItem[] = [
  { id: 'hero', label: 'Welcome / Home', shortLabel: 'Home', iconSrc: '/home.png' },
  { id: 'features', label: 'Core Features', shortLabel: 'Features', iconSrc: '/feature.svg' },
  { id: 'upcoming', label: 'Upcoming Drives', shortLabel: 'Drives', iconSrc: '/upcoming.png' },
  { id: 'gallery', label: 'Impact Gallery', shortLabel: 'Gallery', iconSrc: '/gallery.png' },
  { id: 'newsletter', label: 'Weekly Digest', shortLabel: 'Newsletter', iconSrc: '/weekly.png' },
];

export default function SectionNavigator() {
  const [activeId, setActiveId] = useState<string>('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only display if these sections actually exist on the current page
    const found = SECTIONS.some((s) => document.getElementById(s.id));
    setIsVisible(found);

    if (!found) return;

    // Observe sections to highlight the active section automatically
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.1,
      }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  const currentIndex = SECTIONS.findIndex((s) => s.id === activeId);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    const prevIndex = Math.max(0, currentIndex - 1);
    scrollTo(SECTIONS[prevIndex].id);
  };

  const handleNext = () => {
    const nextIndex = Math.min(SECTIONS.length - 1, currentIndex + 1);
    scrollTo(SECTIONS[nextIndex].id);
  };

  return (
    <aside
      aria-label="Section Quick Navigation"
      className="fixed right-3.5 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2 select-none"
    >
      <div className="flex flex-col items-center gap-1.5 p-2 rounded-full bg-white/80 dark:bg-[#0c1630]/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_10px_35px_-8px_rgba(0,120,200,0.3)] dark:shadow-[0_0_30px_-6px_rgba(34,211,238,0.25)]">
        {/* Jump Up Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex <= 0}
          aria-label="Previous section"
          className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-[#00D4FF] hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        {/* Section Icons */}
        <div className="flex flex-col items-center gap-2 py-1">
          {SECTIONS.map((sec, idx) => {
            const isActive = activeId === sec.id;

            return (
              <div key={sec.id} className="relative group flex items-center">
                {/* Tooltip on left */}
                <div className="pointer-events-none absolute right-full mr-3.5 hidden group-hover:flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#0B2447] dark:bg-[#15152E] px-3 py-1.5 text-xs font-semibold text-white shadow-xl border border-white/10 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0">
                  <Image
                    src={sec.iconSrc}
                    alt={sec.label}
                    width={14}
                    height={14}
                    unoptimized
                    className="h-3.5 w-3.5 object-contain brightness-0 invert shrink-0"
                  />
                  <span>{sec.label}</span>
                  <span className="text-[10px] text-slate-400 ml-1">#{idx + 1}</span>
                </div>

                {/* Section Icon Button */}
                <button
                  type="button"
                  onClick={() => scrollTo(sec.id)}
                  aria-label={`Jump to ${sec.label}`}
                  title={sec.label}
                  className={`relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'h-8 w-8 bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-md shadow-sky-500/40 ring-2 ring-sky-400/50 scale-105'
                      : 'h-7 w-7 hover:bg-slate-100 dark:hover:bg-white/10 hover:scale-110'
                  }`}
                >
                  <Image
                    src={sec.iconSrc}
                    alt={sec.label}
                    width={20}
                    height={20}
                    unoptimized
                    className={`object-contain transition-all duration-200 ${
                      isActive
                        ? 'w-4 h-4 brightness-0 invert animate-in zoom-in-75 duration-200'
                        : 'w-3.5 h-3.5 opacity-60 group-hover:opacity-100 dark:brightness-0 dark:invert dark:opacity-70 dark:group-hover:opacity-100'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Jump Down Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex >= SECTIONS.length - 1}
          aria-label="Next section"
          className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-[#00D4FF] hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
