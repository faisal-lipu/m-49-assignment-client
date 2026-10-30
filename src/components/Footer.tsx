// ==============================================================
// Footer Component
// Eye-catching community footer with social links (new X logo used)
// ==============================================================

import React from "react";
import Link from "next/link";
import { HeartHandshake, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300 text-base-content mt-auto transition-colors">
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-extrabold tracking-tight">Maitri</span>
            </Link>
            <p className="text-sm text-base-content/70 leading-relaxed">
              A community-driven event management platform empowering people to organize, join, and support local social service events.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* Modern X (formerly Twitter) Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center hover:bg-primary hover:text-primary-content transition-colors"
                title="Follow us on X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* GitHub SVG */}
              <a
                href="https://github.com/faisal-lipu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center hover:bg-primary hover:text-primary-content transition-colors"
                title="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* Facebook SVG */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center hover:bg-primary hover:text-primary-content transition-colors"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-base-content">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-base-content/70">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/upcoming-events" className="hover:text-primary transition-colors">Upcoming Events</Link>
              </li>
              <li>
                <Link href="/create-event" className="hover:text-primary transition-colors">Create an Event</Link>
              </li>
              <li>
                <Link href="/joined-events" className="hover:text-primary transition-colors">My Joined Events</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Event Categories */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-base-content">Event Types</h3>
            <ul className="space-y-2.5 text-sm text-base-content/70">
              <li>Winter Clothes Distribution</li>
              <li>Blanket Distribution Drive</li>
              <li>City & Park Cleanups</li>
              <li>Tree Plantation Campaigns</li>
              <li>Food & Ration Relief</li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-base-content">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-base-content/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Mirpur & Mohammadpur, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@maitri-events.org</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="border-t border-base-300 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60 gap-4">
          <p>© {new Date().getFullYear()} Maitri Social Platform. All rights reserved.</p>
          <p>Together for a cleaner, kinder, and better tomorrow.</p>
        </div>
      </div>
    </footer>
  );
}
