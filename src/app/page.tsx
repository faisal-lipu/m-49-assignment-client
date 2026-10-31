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
import HeroSection from "@/components/HeroSection";
import UpcomingDrives from "@/components/UpcomingDrives";
import FeaturesSection from "@/components/FeaturesSection";
import GallerySection from "@/components/GallerySection";
import NewsletterSection from "@/components/NewsletterSection";

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
          2. FEATURE SECTION (Interactive Bento Grid with Demos)
      ======================================================== */}
      <FeaturesSection />

      {/* ========================================================
          3. UPCOMING DRIVES (Ticket Cards & Interactive Empty State)
      ======================================================== */}
      <UpcomingDrives events={recentEvents} />

      {/* ========================================================
          4. COMMUNITY GALLERY SECTION (Expanding Accordion Panels)
      ======================================================== */}
      <GallerySection />

      {/* ========================================================
          5. NEWSLETTER SECTION (Weekly Digest & Topic Picker)
      ======================================================== */}
      <NewsletterSection />

    </div>
  );
}
