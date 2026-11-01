'use client';

// ==============================================================
// Upcoming Events Page (/upcoming-events & /events)
// Features: Real-time Title Search, Category Filter, Sort Filter,
// Responsive Grid, Days-Left Countdown, Skeletons & Empty State.
// ==============================================================

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Grid3X3,
  List,
  FilterX,
  RefreshCw,
  HeartHandshake,
  TreePine,
  Trash2,
  UtensilsCrossed,
  Stethoscope,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { getServerUrl } from '@/lib/api';

export interface EventItem {
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

// Fallback sample data in case of initial server cold-start
const FALLBACK_EVENTS: EventItem[] = [
  {
    _id: '6ae6104ef9b7f4b364fe903f',
    title: 'Winter Warmth: Clothes & Blanket Distribution',
    description:
      'Join Maitri volunteers to distribute thermal blankets, jackets, and winter essentials to underprivileged families, homeless elders, and children facing harsh temperatures across Mirpur.',
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
  {
    _id: '6ae6104ef9b7f4b364fe9040',
    title: 'Clean Dhaka Campaign: Dhanmondi Lake Drive',
    description:
      'A community-driven lakefront cleanup. We will collect single-use plastics, clear clogged walkways, install segregated waste bins, and raise civic awareness for an eco-friendly neighborhood.',
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
  {
    _id: '6ae6104ef9b7f4b364fe9041',
    title: 'Green Canopy: Urban Tree Plantation in Ramna',
    description:
      'Help restore Dhaka urban greenery by planting over 500 indigenous fruit, medicinal, and shade trees. Free saplings, gardening gloves, and water cans will be supplied to all participants.',
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
  {
    _id: '6ae6104ef9b7f4b364fe9042',
    title: 'Nourish Hope: Hot Meal & Nutrition Drive',
    description:
      'Distributing balanced, fresh cooked meals and nutrition packs to rickshaw pullers, street vendors, and low-income families around Lalbagh and surrounding riverbank areas.',
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
  {
    _id: '6ae6104ef9b7f4b364fe9043',
    title: 'Free Health Screening & Pediatric Care Camp',
    description:
      'Volunteer doctors and nurses offering free general health checkups, blood sugar screenings, pediatric care consultations, and essential over-the-counter medicine distribution.',
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
  {
    _id: '6ae6104ef9b7f4b364fe9044',
    title: 'Bright Futures: Slum Literacy & Book Donation',
    description:
      'Collecting storybooks, primary learning materials, stationery boxes, and school bags for children in informal settlements. Volunteers will also conduct an open reading circle.',
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
];

// Category metadata with custom badges and icons
const CATEGORIES = [
  { id: 'all', label: 'All Drives', icon: Layers, color: 'text-sky-500' },
  { id: 'Cleanup', label: 'Cleanup', icon: Trash2, color: 'text-cyan-500' },
  { id: 'Plantation', label: 'Plantation', icon: TreePine, color: 'text-emerald-500' },
  { id: 'Donation', label: 'Donation', icon: HeartHandshake, color: 'text-blue-500' },
  { id: 'Food Relief', label: 'Food Relief', icon: UtensilsCrossed, color: 'text-amber-500' },
  { id: 'Healthcare', label: 'Healthcare', icon: Stethoscope, color: 'text-rose-500' },
  { id: 'Education', label: 'Education', icon: GraduationCap, color: 'text-purple-500' },
];

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'title-asc'>('date-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch events from server
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const serverUrl = getServerUrl();
      const res = await fetch(`${serverUrl}/api/events/upcoming`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setEvents(data.data);
      } else {
        // Use fallback if server returns empty set or is cold
        setEvents(FALLBACK_EVENTS);
      }
    } catch (err: unknown) {
      console.warn('Backend fetch failed, falling back to local dataset:', err);
      setEvents(FALLBACK_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtered & sorted events list
  const filteredEvents = useMemo(() => {
    return events
      .filter((ev) => {
        // Search by Title (case-insensitive)
        const matchTitle = ev.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchLocation = ev.location.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesSearch = matchTitle || matchLocation;

        // Filter by Category
        const matchesCategory =
          selectedCategory === 'all' ||
          ev.eventType.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'date-asc') {
          return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        }
        if (sortBy === 'date-desc') {
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [events, searchQuery, selectedCategory, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('date-asc');
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate days remaining
  const getDaysRemaining = (dateStr: string) => {
    try {
      const target = new Date(dateStr).getTime();
      const now = new Date().getTime();
      const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      return `In ${diffDays} days`;
    } catch {
      return '';
    }
  };

  // Category badge color lookup
  const getCategoryBadgeClass = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'cleanup':
        return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
      case 'plantation':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'donation':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'food relief':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'healthcare':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'education':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      default:
        return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30';
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ------------------------------------------------------------- */}
      {/* 1. Header Banner & Intro */}
      {/* ------------------------------------------------------------- */}
      <div className="text-center max-w-3xl mx-auto mb-10 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300 shadow-sm mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span>Community Impact Hub</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B2447] dark:text-[#E8F0FF] mb-4">
          Upcoming Social Drives & Events
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Discover verified volunteer drives, flood relief, tree plantations, cleanups, and healthcare
          camps. Search by event title or filter by category to find opportunities near you.
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Interactive Search & Filter Bar */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white/80 dark:bg-[#0c1630]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 sm:p-6 shadow-sm mb-8 transition-all">
        {/* Search Input and Sort Row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-5">
          {/* Search by Title Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drives by event title or location..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown & Layout Toggles */}
          <div className="flex items-center gap-2.5 justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 cursor-pointer"
              >
                <option value="date-asc">Date: Nearest First</option>
                <option value="date-desc">Date: Furthest First</option>
                <option value="title-asc">Title: A to Z</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-[#081024] p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-sky-500 text-sky-600 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-sky-500 text-sky-600 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="border-t border-slate-200/60 dark:border-white/5 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Category:
            </span>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-sky-500 text-white font-semibold shadow-sm shadow-sky-500/25 ring-2 ring-sky-500/40'
                      : 'bg-slate-100/90 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : cat.color}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Chips & Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-dashed border-slate-200/60 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-bold text-[#0B2447] dark:text-[#E8F0FF]">{filteredEvents.length}</span>{' '}
            {filteredEvents.length === 1 ? 'event' : 'events'}
            {selectedCategory !== 'all' && (
              <span>
                {' '}
                in <span className="font-semibold text-sky-600 dark:text-sky-400">{selectedCategory}</span>
              </span>
            )}
            {searchQuery && (
              <span>
                {' '}
                matching &ldquo;<span className="font-semibold text-sky-600 dark:text-sky-400">{searchQuery}</span>&rdquo;
              </span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all' || sortBy !== 'date-asc') && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors"
            >
              <FilterX className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Event Cards Grid / List View */}
      {/* ------------------------------------------------------------- */}
      {loading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-[#0c1630]/60 p-4 animate-pulse"
            >
              <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              </div>
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md mb-2"></div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md mb-1"></div>
              <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md mb-4"></div>
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        /* Empty State */
        <div className="bg-white/60 dark:bg-[#0c1630]/60 border border-dashed border-slate-300 dark:border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#0B2447] dark:text-[#E8F0FF] mb-2">
            No Events Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            We couldn&apos;t find any events matching your search query &ldquo;{searchQuery}&rdquo; in category &ldquo;
            {selectedCategory}&rdquo;. Try adjusting your keywords or clearing the filters.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reset All Filters
            </button>
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-medium text-sm transition-all"
            >
              Organize New Event
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const daysRemaining = getDaysRemaining(ev.eventDate);
            return (
              <div
                key={ev._id}
                className="group relative flex flex-col rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c1630]/90 backdrop-blur-md overflow-hidden hover:shadow-xl hover:border-sky-500/40 dark:hover:border-sky-400/40 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Event Thumbnail */}
                <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={ev.thumbnail || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1200'}
                    alt={ev.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Category Pill Over Image */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-md ${getCategoryBadgeClass(
                        ev.eventType
                      )}`}
                    >
                      {ev.eventType}
                    </span>
                  </div>

                  {/* Days Remaining Pill Over Image */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20">
                      <Clock className="w-3 h-3 text-sky-400" />
                      {daysRemaining}
                    </span>
                  </div>

                  {/* Date Block Over Image Bottom */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white/90">
                    <Calendar className="w-3.5 h-3.5 text-sky-300" />
                    <span>{formatDate(ev.eventDate)}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Title */}
                  <h2 className="text-lg font-bold text-[#0B2447] dark:text-[#E8F0FF] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 mb-2">
                    {ev.title}
                  </h2>

                  {/* Location */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{ev.location}</span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {ev.description}
                  </p>

                  {/* Organizer & Capacity Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 flex items-center justify-center font-bold text-[10px]">
                        {(ev.creatorName || 'M')[0].toUpperCase()}
                      </div>
                      <span className="truncate max-w-[110px]">{ev.creatorName || 'Organizer'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{ev.joinedCount ?? 24} joined</span>
                    </div>
                  </div>

                  {/* CTA Action Button */}
                  <Link
                    href={`/events/${ev._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-700 hover:text-white dark:bg-sky-500/20 dark:hover:bg-sky-500 dark:text-sky-300 dark:hover:text-white border border-sky-500/20 hover:border-sky-500 text-xs sm:text-sm font-semibold transition-all duration-200"
                  >
                    <span>View Details & Join</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="flex flex-col gap-4">
          {filteredEvents.map((ev) => {
            const daysRemaining = getDaysRemaining(ev.eventDate);
            return (
              <div
                key={ev._id}
                className="group relative flex flex-col sm:flex-row items-stretch rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c1630]/90 backdrop-blur-md overflow-hidden hover:shadow-lg hover:border-sky-500/40 dark:hover:border-sky-400/40 transition-all p-3 sm:p-4 gap-4"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-48 h-36 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={ev.thumbnail || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1200'}
                    alt={ev.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border backdrop-blur-md ${getCategoryBadgeClass(
                      ev.eventType
                    )}`}
                  >
                    {ev.eventType}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        {formatDate(ev.eventDate)}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-medium text-sky-600 dark:text-sky-400">
                        <Clock className="w-3.5 h-3.5" />
                        {daysRemaining}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {ev.location}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-[#0B2447] dark:text-[#E8F0FF] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 mb-1.5">
                      {ev.title}
                    </h2>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-2">
                      {ev.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>By <strong className="text-slate-700 dark:text-slate-200">{ev.creatorName || 'Organizer'}</strong></span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Users className="w-3.5 h-3.5" />
                        {ev.joinedCount ?? 24} joined
                      </span>
                    </div>

                    <Link
                      href={`/events/${ev._id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-xs transition-all"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
