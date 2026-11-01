'use client';

// ==============================================================
// Footer Component
// Modern community footer with interactive copy email badge,
// glowing aurora edge, fast route links, event categories, and ghost wordmark.
// ==============================================================

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Copy, Check, ArrowUp } from 'lucide-react';

const EMAIL = 'support@maitri-events.org';

const QUICK = [
  { label: 'Home', href: '/' },
  { label: 'Upcoming Events', href: '/upcoming-events' },
  { label: 'Create an Event', href: '/create-event' },
  { label: 'My Joined Events', href: '/joined-events' },
];

const TYPES = [
  { label: 'Winter Clothes Distribution', href: '/upcoming-events?type=winter-clothes', c: '#B3A8FF' },
  { label: 'Blanket Distribution Drive', href: '/upcoming-events?type=blankets', c: '#FF8FB5' },
  { label: 'City & Park Cleanups', href: '/upcoming-events?type=cleanup', c: '#22D3EE' },
  { label: 'Tree Plantation Campaigns', href: '/upcoming-events?type=trees', c: '#2DE2C0' },
  { label: 'Food & Ration Relief', href: '/upcoming-events?type=food', c: '#7DA2FF' },
];

/* ব্র্যান্ড আইকন inline SVG, যাতে lucide-react ভার্সনের ওপর নির্ভর না করে */
const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.09 24 12.07z" />
  </svg>
);

const SOCIAL = [
  { label: 'X (Twitter)', href: 'https://x.com', Icon: XIcon },
  { label: 'GitHub', href: 'https://github.com/faisal-lipu', Icon: GithubIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
];

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22D3EE]';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  dot?: string;
}

function FooterLink({ href, children, dot }: FooterLinkProps) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 text-[#B8C7E8] transition-colors hover:text-white ${focus}`}>
      {dot ? (
        <span className="h-2 w-2 rounded-full transition-transform group-hover:scale-125" style={{ background: dot }} />
      ) : (
        <span className="h-px w-0 bg-[#22D3EE] transition-all duration-300 group-hover:w-4" />
      )}
      {children}
    </Link>
  );
}

export default function Footer() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }

  return (
    <footer className="relative overflow-hidden bg-[#0B2447] text-white dark:bg-[#060D1F]">
      {/* aurora top edge + glows */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#00B8D9]/20 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-[#7B61FF]/25 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.1fr_1.2fr] lg:gap-10">
          {/* brand */}
          <div>
            <Link href="/" className={`inline-flex items-center gap-3 ${focus}`} aria-label="Maitri home">
              <div className="relative h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 dark:from-sky-400/20 dark:to-blue-600/20 p-1 border border-sky-500/20 dark:border-sky-400/30 shadow-sm dark:shadow-[0_0_16px_rgba(56,189,248,0.35)] transition-all duration-300">
                {/* Light Mode Logo */}
                <Image
                  src="/compassion.png"
                  alt="Maitri Compassion Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain block dark:hidden drop-shadow-sm transition-transform duration-300"
                />
                {/* Dark Mode Logo */}
                <Image
                  src="/light-compassion-v2.png"
                  alt="Maitri Compassion Logo (Dark)"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain hidden dark:block scale-[1.08] drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-transform duration-300"
                />
              </div>
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-[#38BDF8] dark:via-[#818CF8] dark:to-[#34D399] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
                Maitri
              </span>
            </Link>
            <p className="mt-5 max-w-xs leading-relaxed text-[#B8C7E8]">
              A community-driven event platform that helps people organise, join and support local social service events.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-[#B8C7E8] transition hover:-translate-y-1 hover:border-transparent hover:bg-gradient-to-br hover:from-[#00C6FF] hover:to-[#7B61FF] hover:text-white hover:shadow-[0_0_24px_-2px_rgba(34,211,238,0.6)] ${focus}`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* quick links */}
          <nav aria-label="Quick links">
            <h3 className="text-lg font-bold">Quick links</h3>
            <ul className="mt-5 space-y-3.5">
              {QUICK.map((l) => (<li key={l.href}><FooterLink href={l.href}>{l.label}</FooterLink></li>))}
            </ul>
          </nav>

          {/* event types */}
          <nav aria-label="Event types">
            <h3 className="text-lg font-bold">Event types</h3>
            <ul className="mt-5 space-y-3.5">
              {TYPES.map((l) => (<li key={l.href}><FooterLink href={l.href} dot={l.c}>{l.label}</FooterLink></li>))}
            </ul>
          </nav>

          {/* contact card */}
          <div>
            <h3 className="text-lg font-bold">Get in touch</h3>
            <div className="mt-5 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Mirpur+Mohammadpur+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex gap-3 text-[#B8C7E8] transition-colors hover:text-white ${focus}`}
              >
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#22D3EE]" />
                <span>Mirpur &amp; Mohammadpur,<br />Dhaka, Bangladesh</span>
              </a>
              <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <a href={`mailto:${EMAIL}`} className={`flex min-w-0 items-center gap-3 text-[#B8C7E8] transition-colors hover:text-white ${focus}`}>
                  <Mail className="h-5 w-5 shrink-0 text-[#22D3EE]" />
                  <span className="truncate">{EMAIL}</span>
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/15 transition hover:bg-white/10 ${copied ? 'bg-[#2DE2C0] text-[#06161C] hover:bg-[#2DE2C0]' : 'text-[#B8C7E8]'} ${focus}`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="sr-only" role="status" aria-live="polite">{copied ? 'Email address copied' : ''}</p>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-[#8EA0C4]">
          <p>© {new Date().getFullYear()} Maitri Social Platform. All rights reserved.</p>
          <p className="order-last w-full text-[#B8C7E8] sm:order-none sm:w-auto">Together for a cleaner, kinder and better tomorrow.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-semibold text-[#B8C7E8] transition hover:bg-white/10 hover:text-white ${focus}`}
          >
            Back to top <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* oversized ghost wordmark, cropped at the bottom */}
      <div aria-hidden className="pointer-events-none relative h-[clamp(4rem,13vw,11rem)] select-none overflow-hidden">
        <p className="bg-gradient-to-b from-[#22D3EE]/35 via-[#7B61FF]/20 to-transparent bg-clip-text text-center text-[clamp(6rem,24vw,22rem)] font-extrabold leading-[0.8] tracking-tighter text-transparent">
          Maitri
        </p>
      </div>
    </footer>
  );
}
