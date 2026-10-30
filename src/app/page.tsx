"use client";

// ==============================================================
// Maitri - Home Page (Adaptive Dual Color Palettes with Dark Mode Pro Tips)
// Light Mode: Electric Frost & Cyan (#3B6CFF, #00D4FF, #F4F8FF, #0F1B3D)
// Dark Mode:  Neon Indigo (#0B0B1E, #15152E, #201F42, #6366F1, #06D6F0, #EEF0FF)
//
// Follows all Dark Mode Design Tips:
// 1. Avoids Pure Black (#000) -> Uses #0B0B1E (Ink Black)
// 2. Elevation: Background (#0B0B1E) -> Surface (#15152E) -> Elevated (#201F42)
// 3. Neon Glow Effect: box-shadow 0 0 24px rgba(6, 214, 240, 0.35)
// 4. Subtle Border: 1px solid rgba(255, 255, 255, 0.08)
// 5. Soft Text: Lavender White #EEF0FF (No harsh pure #fff)
// 6. Contrast: Dark text on Neon buttons (#0B0B1E)
// ==============================================================

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Compass,
  Users2,
  Sparkles,
  Send,
  PlusCircle,
  Award,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorName?: string;
}

export default function HomePage() {
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch 6 recent upcoming events from backend (.limit(6))
  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_SERVER_URL ||
          "https://m-49-assignment-server.onrender.com";

        const res = await fetch(`${serverUrl}/api/events/recent`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setRecentEvents(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch recent events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      
      {/* ========================================================
          1. HERO BANNER SECTION (Animated Aurora & 3D Layered Composition)
      ======================================================== */}
      <HeroSection />

      {/* ========================================================
          2. FEATURE SECTION (Elevation: Base 200 Surface)
      ======================================================== */}
      <section className="py-20 bg-base-200 border-y border-base-300 transition-colors">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Platform Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-base-content">
              Purpose-Built for Community Action
            </h2>
            <p className="text-sm opacity-75 mt-2">
              Every tool and workflow designed to make neighborhood participation frictionless and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 (Elevated card on base 200) */}
            <div className="bg-base-100 p-8 rounded-3xl border border-subtle shadow-md neon-glow-hover flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-base-content">Hyperlocal Discovery</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Filter social drives by your exact neighborhood in Dhaka. Connect with volunteers operating within walking distance of your home.
                </p>
              </div>
              <div className="pt-6 border-t border-base-300 mt-6 text-xs font-semibold text-secondary flex items-center gap-1">
                <span>Browse by location</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-base-100 p-8 rounded-3xl border border-subtle shadow-md neon-glow-hover flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center">
                  <Users2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-base-content">Zero-Friction Joining</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Join any upcoming drive with a single click. Maintain your personal volunteer portfolio and coordinate directly with event leaders.
                </p>
              </div>
              <div className="pt-6 border-t border-base-300 mt-6 text-xs font-semibold text-secondary flex items-center gap-1">
                <span>Instant participation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-base-100 p-8 rounded-3xl border border-subtle shadow-md neon-glow-hover flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-base-content">Transparent Accountability</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Organizers link verified profiles with clear timelines, location tags, and post-drive photo updates to maintain community trust.
                </p>
              </div>
              <div className="pt-6 border-t border-base-300 mt-6 text-xs font-semibold text-secondary flex items-center gap-1">
                <span>Verified campaigns</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          3. RECENT UPCOMING EVENTS (Dynamic - 6 Events via .limit(6))
      ======================================================== */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Upcoming Drives
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-base-content">
                Next In Line in Your City
              </h2>
              <p className="text-sm opacity-75 mt-1">
                Scheduled social events awaiting volunteer participation.
              </p>
            </div>
            
            <Link
              href="/upcoming-events"
              className="btn btn-sm bg-base-200 hover:bg-secondary text-base-content hover:text-secondary-content border-none rounded-xl px-5 font-bold gap-2 transition-all neon-glow-hover"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid Layout */}
          {loading ? (
            // Skeleton Loaders
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-base-200 animate-pulse h-96 rounded-3xl border border-subtle" />
              ))}
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-base-200 rounded-3xl overflow-hidden border border-subtle shadow-lg neon-glow-hover flex flex-col h-full group"
                >
                  {/* Thumbnail Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-base-300">
                    <Image
                      src={event.thumbnail}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      {/* High Contrast Neon Cyan Badge */}
                      <span className="px-3 py-1 rounded-lg bg-secondary text-secondary-content font-black text-xs shadow-md">
                        {event.eventType}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold line-clamp-1 group-hover:text-secondary transition-colors text-base-content">
                        {event.title}
                      </h3>
                      <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="pt-3 space-y-2 text-xs font-medium opacity-85">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-secondary shrink-0" />
                          <span>{event.eventDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-6 mt-4 border-t border-base-300">
                      <Link
                        href={`/events/${event._id}`}
                        className="btn btn-primary text-primary-content w-full rounded-xl btn-sm font-bold border-none indigo-glow-hover"
                      >
                        View Event Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-20 bg-base-200 rounded-3xl border border-dashed border-base-300 p-8 shadow-sm">
              <Calendar className="w-14 h-14 text-secondary/40 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-base-content">No Upcoming Events Right Now</h3>
              <p className="text-sm opacity-70 max-w-md mx-auto mt-2 mb-6">
                Be the champion your community needs! Organize the very first social initiative on Maitri today.
              </p>
              <Link
                href="/create-event"
                className="btn btn-secondary text-secondary-content rounded-xl px-6 font-bold border-none neon-glow-hover"
              >
                Create First Event
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================
          4. COMMUNITY GALLERY SECTION (Unique Curated High-Res Photos)
      ======================================================== */}
      <section className="py-20 bg-base-200 border-t border-base-300 transition-colors">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Ground Realities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-base-content">
              Solidarity Through Action
            </h2>
            <p className="text-sm opacity-75 mt-2">
              Genuine moments captured during volunteer distributions and environmental campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Gallery Item 1: Tree Plantation */}
            <div className="relative h-72 rounded-3xl overflow-hidden shadow-lg group border border-subtle neon-glow-hover">
              <Image
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
                alt="Community planting saplings in Dhaka park"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <span className="text-secondary text-xs font-extrabold uppercase tracking-wider">Environmental Drive</span>
                <h4 className="text-white font-bold text-base mt-0.5">Urban Tree Planting</h4>
              </div>
            </div>

            {/* Gallery Item 2: Winter Clothes Drive */}
            <div className="relative h-72 rounded-3xl overflow-hidden shadow-lg group border border-subtle neon-glow-hover">
              <Image
                src="https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&q=80&w=800"
                alt="Winter clothes collection and distribution"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <span className="text-secondary text-xs font-extrabold uppercase tracking-wider">Winter Warmth</span>
                <h4 className="text-white font-bold text-base mt-0.5">Blanket & Clothes Distribution</h4>
              </div>
            </div>

            {/* Gallery Item 3: Neighborhood Cleanup */}
            <div className="relative h-72 rounded-3xl overflow-hidden shadow-lg group border border-subtle neon-glow-hover">
              <Image
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800"
                alt="Volunteers cleaning up local lake and street"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <span className="text-secondary text-xs font-extrabold uppercase tracking-wider">Clean Cities</span>
                <h4 className="text-white font-bold text-base mt-0.5">Neighborhood Waste Cleanup</h4>
              </div>
            </div>

            {/* Gallery Item 4: Food & Ration Distribution */}
            <div className="relative h-72 rounded-3xl overflow-hidden shadow-lg group border border-subtle neon-glow-hover">
              <Image
                src="https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&q=80&w=800"
                alt="Volunteers packaging warm meal boxes"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <span className="text-secondary text-xs font-extrabold uppercase tracking-wider">Food Security</span>
                <h4 className="text-white font-bold text-base mt-0.5">Emergency Ration Packing</h4>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          5. NEWSLETTER SECTION
      ======================================================== */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary text-white shadow-2xl border border-subtle">
            
            {/* Background Decorative Rings */}
            <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-secondary/30 blur-xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5">
              <div className="inline-flex p-3 rounded-2xl bg-white/15 backdrop-blur-md shadow-inner">
                <Send className="w-6 h-6 text-secondary" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                Get Weekly Updates on Causes That Matter
              </h2>

              <p className="text-sm sm:text-base text-white/85 max-w-lg mx-auto leading-relaxed">
                Stay updated with verified volunteering opportunities, urgent medical relief requests, and community events directly in your inbox.
              </p>

              {/* Form with Toast Feedback (No default browser alert!) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Thank you for subscribing to Maitri Community Newsletter!");
                }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="input input-bordered w-full rounded-xl bg-base-100 text-base-content text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-secondary border-none shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className="btn btn-secondary text-secondary-content w-full sm:w-auto rounded-xl px-7 font-black border-none shadow-md"
                >
                  Subscribe
                </button>
              </form>

              <p className="text-xs text-white/70 pt-1">
                Zero spam. You can unsubscribe anytime with one click.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
