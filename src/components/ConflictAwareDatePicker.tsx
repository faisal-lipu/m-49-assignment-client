'use client';

// ==============================================================
// ConflictAwareDatePicker Component
// Interactive Month Calendar Picker with Conflict Awareness:
// - Dates with scheduled events are locked/unclickable (cursor-not-allowed)
// - Hovering over booked dates displays rich tooltip with event summary
// - Past dates are disabled
// - Available future dates are selectable
// - Visual legend & instant status inspector
// ==============================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Tag,
  MapPin,
  Info,
} from 'lucide-react';
import { getServerUrl } from '@/lib/api';
import { toast } from 'sonner';

export interface ScheduledEvent {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  eventType: string;
  location: string;
  eventDate: string;
}

// Fallback seed events if server is waking from cold start
const FALLBACK_SCHEDULED: ScheduledEvent[] = [
  {
    _id: '1',
    title: 'Clean Dhaka Campaign: Dhanmondi Lake Drive',
    description: 'A community-driven lakefront cleanup. We will collect single-use plastics and clear walkways.',
    eventType: 'Cleanup',
    location: 'Dhanmondi Lake Amphitheater, Dhaka',
    eventDate: '2026-11-22',
  },
  {
    _id: '2',
    title: 'Green Canopy: Urban Tree Plantation in Ramna',
    description: 'Help restore Dhaka urban greenery by planting over 500 indigenous fruit and shade trees.',
    eventType: 'Plantation',
    location: 'Ramna Park South Gate, Dhaka',
    eventDate: '2026-12-05',
  },
  {
    _id: '3',
    title: 'Nourish Hope: Hot Meal & Nutrition Drive',
    description: 'Distributing balanced meals and nutrition packs to rickshaw pullers and low-income families.',
    eventType: 'Food Relief',
    location: 'Lalbagh Fort Grounds, Old Dhaka',
    eventDate: '2026-12-18',
  },
  {
    _id: '4',
    title: 'Free Health Screening & Pediatric Care Camp',
    description: 'Volunteer doctors offering free general checkups, blood sugar screenings, and pediatric care.',
    eventType: 'Healthcare',
    location: 'Kurmitola High School Campus, Dhaka',
    eventDate: '2027-01-10',
  },
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface ConflictAwareDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  required?: boolean;
}

export default function ConflictAwareDatePicker({
  value,
  onChange,
}: ConflictAwareDatePickerProps) {
  // Calendar view navigation state
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  // Current displayed year and month
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth()); // 0-indexed

  // Scheduled events state
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);

  // Active hover/touch state for rich tooltip
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<ScheduledEvent | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch upcoming events from backend
  useEffect(() => {
    let isMounted = true;
    const fetchUpcoming = async () => {
      try {
        setIsLoadingEvents(true);
        const serverUrl = getServerUrl();
        const res = await fetch(`${serverUrl}/api/events/upcoming`, { cache: 'no-store' });
        const data = await res.json();

        if (isMounted) {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setScheduledEvents(data.data);
          } else {
            setScheduledEvents(FALLBACK_SCHEDULED);
          }
        }
      } catch (err) {
        console.warn('Using fallback scheduled events due to network error:', err);
        if (isMounted) {
          setScheduledEvents(FALLBACK_SCHEDULED);
        }
      } finally {
        if (isMounted) {
          setIsLoadingEvents(false);
        }
      }
    };

    fetchUpcoming();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Map of scheduled events by YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = new Map<string, ScheduledEvent>();
    for (const ev of scheduledEvents) {
      if (ev.eventDate) {
        const cleanDate = ev.eventDate.split('T')[0];
        map.set(cleanDate, ev);
      }
    }
    return map;
  }, [scheduledEvents]);

  // 3. Calendar Grid Computation
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  // Day interaction handlers
  const handleDayClick = (dateStr: string, hasConflict: boolean, isPast: boolean) => {
    if (isPast) {
      toast.error('Past dates cannot be selected. Please choose a future date.');
      return;
    }

    if (hasConflict) {
      const conflict = eventsByDate.get(dateStr);
      toast.warning(
        `Date Locked: "${conflict?.title || 'Another drive'}" is already scheduled on ${dateStr}. Please select an open date.`,
        { duration: 4000 }
      );
      return;
    }

    onChange(dateStr);
    toast.success(`Date selected: ${dateStr}`);
  };

  const handleDayMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement>,
    dateStr: string,
    event?: ScheduledEvent
  ) => {
    setHoveredDate(dateStr);
    setHoveredEvent(event || null);

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const targetRect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({
        x: targetRect.left - containerRect.left + targetRect.width / 2,
        y: targetRect.top - containerRect.top,
      });
    }
  };

  const handleDayMouseLeave = () => {
    setHoveredDate(null);
    setHoveredEvent(null);
    setTooltipPos(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/70 dark:bg-[#070e20] p-4 sm:p-5 shadow-inner transition-all select-none"
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Calendar Header & Navigation */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#0B2447] dark:text-[#E8F0FF]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              {isLoadingEvents ? 'Checking schedule...' : `${scheduledEvents.length} events active`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleJumpToToday}
            className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            className="w-7 h-7 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next Month"
            className="w-7 h-7 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Weekday Header Labels */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAY_NAMES.map((name) => (
          <div
            key={name}
            className="text-[11px] font-bold text-slate-400 dark:text-slate-500 py-1"
          >
            {name}
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Days Grid */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 relative">
        {/* Leading empty cells */}
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-9 sm:h-10" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const monthStr = String(viewMonth + 1).padStart(2, '0');
          const dayStr = String(dayNum).padStart(2, '0');
          const dateStr = `${viewYear}-${monthStr}-${dayStr}`;

          const isPast = dateStr < todayStr;
          const isToday = dateStr === todayStr;
          const hasConflict = eventsByDate.has(dateStr);
          const conflictEvent = eventsByDate.get(dateStr);
          const isSelected = value === dateStr;

          // Compute Cell Appearance
          let cellStyle = 'bg-white dark:bg-[#0c1630] text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-500/5';

          if (isSelected) {
            cellStyle = 'bg-sky-500 text-white font-extrabold ring-2 ring-sky-400 ring-offset-2 dark:ring-offset-[#070e20] shadow-md shadow-sky-500/30 scale-[1.03]';
          } else if (hasConflict) {
            // Locked & unclickable
            cellStyle = 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-400 font-bold cursor-not-allowed hover:bg-amber-500/25';
          } else if (isPast) {
            cellStyle = 'opacity-35 text-slate-400 dark:text-slate-600 bg-transparent border-transparent cursor-not-allowed';
          }

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isPast || hasConflict}
              onClick={() => handleDayClick(dateStr, hasConflict, isPast)}
              onMouseEnter={(e) => handleDayMouseEnter(e, dateStr, conflictEvent)}
              onMouseLeave={handleDayMouseLeave}
              aria-label={
                hasConflict
                  ? `Date locked: ${conflictEvent?.title}`
                  : `Select date ${dateStr}`
              }
              className={`relative h-9 sm:h-10 rounded-xl border border-slate-200/80 dark:border-white/5 flex flex-col items-center justify-center transition-all text-xs font-semibold ${cellStyle}`}
            >
              <span>{dayNum}</span>

              {/* Indicator dots */}
              {hasConflict && !isSelected && (
                <div className="absolute top-1 right-1 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                </div>
              )}

              {isToday && !isSelected && !hasConflict && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-sky-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. Floating Hover Tooltip (When hovering over a locked event date) */}
      {/* ------------------------------------------------------------- */}
      {hoveredEvent && tooltipPos && (
        <div
          style={{
            left: `${Math.min(Math.max(tooltipPos.x, 140), 320)}px`,
            top: `${Math.max(tooltipPos.y - 120, 10)}px`,
          }}
          className="absolute z-50 -translate-x-1/2 pointer-events-none w-72 p-3 rounded-2xl bg-[#0B2447]/95 dark:bg-[#070e20]/95 backdrop-blur-xl border border-amber-400/30 text-white shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header pill */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Lock className="w-2.5 h-2.5" />
              Date Locked: Event Exists
            </span>
            <span className="text-[10px] text-slate-300 font-mono font-medium">
              {hoveredDate}
            </span>
          </div>

          {/* Event title */}
          <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
            {hoveredEvent.title}
          </h4>

          {/* Category & Location */}
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-300">
            <span className="flex items-center gap-1 text-sky-300">
              <Tag className="w-2.5 h-2.5" />
              {hoveredEvent.eventType}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300 truncate">
              <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
              {hoveredEvent.location}
            </span>
          </div>

          {/* Brief snippet */}
          <p className="text-[10px] text-slate-300/90 mt-1.5 line-clamp-2 leading-relaxed bg-white/5 p-1.5 rounded-lg border border-white/5 text-justify break-words [overflow-wrap:anywhere]">
            {hoveredEvent.description}
          </p>

          <div className="mt-1.5 text-[9px] font-semibold text-amber-300/80 flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Cannot select this date to prevent volunteer schedule conflicts.</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. Calendar Legend */}
      {/* ------------------------------------------------------------- */}
      <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          <span>Available Date</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30 border border-amber-500" />
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            Locked (Hover for details)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span>Past Date</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. Instant Conflict & Selection Status Inspector Panel */}
      {/* ------------------------------------------------------------- */}
      <div className="mt-3">
        {hoveredEvent ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-[11px] block">
                  Inspecting Locked Date ({hoveredDate}):
                </span>
                <span className="font-semibold text-xs block text-[#0B2447] dark:text-[#E8F0FF]">
                  &ldquo;{hoveredEvent.title}&rdquo; ({hoveredEvent.eventType})
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 text-justify break-words [overflow-wrap:anywhere]">
                  {hoveredEvent.description}
                </p>
              </div>
            </div>
          </div>
        ) : value ? (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Selected Date: <strong>{value}</strong> (Open & conflict-free)
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[10px] font-bold underline hover:text-emerald-800 dark:hover:text-emerald-100"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-500 shrink-0" />
            <span>
              Click an open date above to schedule your community event.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
