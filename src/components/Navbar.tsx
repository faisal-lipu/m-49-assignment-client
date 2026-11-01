'use client';

// ==============================================================
// Navbar Component
// Responsive dynamic navbar with dual light & dark themes,
// /compassion.png logo, reading progress indicator, smooth sliding tab pill,
// interactive theme toggle, and conditional auth avatar dropdown.
// ==============================================================

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogIn,
  Menu,
  X,
  Sun,
  Moon,
  User,
  PlusCircle,
  CalendarDays,
  CalendarCheck,
  LogOut,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { clearToken, getServerUrl } from '@/lib/api';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Upcoming Events', href: '/upcoming-events' },
];

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C6FF]';

interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
  className?: string;
}

function ThemeToggle({ dark, onToggle, className = '' }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-[#E8F0FF] transition hover:border-sky-500 hover:bg-slate-200 dark:hover:border-[#00B8D9] dark:hover:bg-white/10 ${focus} ${className}`}
    >
      <Sun className={`absolute h-4.5 w-4.5 text-amber-500 transition-all duration-500 ${dark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} />
      <Moon className={`absolute h-4.5 w-4.5 text-sky-600 dark:text-sky-400 transition-all duration-500 ${dark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
    </button>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, on: false });
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const activeIndex = LINKS.findIndex((l) =>
    l.href === '/'
      ? pathname === '/'
      : pathname?.startsWith(l.href) || (l.href === '/upcoming-events' && pathname?.startsWith('/events'))
  );
  const target = hovered ?? (activeIndex !== -1 ? activeIndex : null);

  /* sliding pill follows hover, rests on the active page */
  useEffect(() => {
    const place = () => {
      if (target !== null && itemRefs.current[target]) {
        const el = itemRefs.current[target];
        if (el) {
          setPill({ left: el.offsetLeft, width: el.offsetWidth, on: true });
          return;
        }
      }
      setPill((p) => ({ ...p, on: false }));
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [target]);

  /* scroll state + reading progress */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 12);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close mobile and profile menus on route change / Escape */
  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut();
      clearToken();
      await fetch(`${getServerUrl()}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      toast.success('Logged out successfully. See you soon!');
      setProfileOpen(false);
      router.push('/');
      router.refresh();
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#070e20]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-colors duration-300">
      <style>{`
        @keyframes mt-wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-10deg) scale(1.06)}75%{transform:rotate(8deg) scale(1.06)}}
        .mt-logo:hover .mt-logo-img{animation:mt-wiggle .6s ease}
        @media (prefers-reduced-motion: reduce){.mt-logo:hover .mt-logo-img{animation:none}}
      `}</style>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Main"
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'py-2.5' : 'py-3.5'
          }`}
        >
          {/* adaptive logo: compassion.png in light mode & light-compassion.png in dark mode */}
          <Link href="/" aria-label="Maitri home" className={`mt-logo flex items-center gap-2.5 rounded-full ${focus}`}>
            <div className="mt-logo-img relative h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-linear-to-br from-sky-500/10 to-blue-500/10 dark:from-sky-400/20 dark:to-blue-600/20 p-1 border border-sky-500/20 dark:border-sky-400/30 shadow-sm dark:shadow-[0_0_16px_rgba(56,189,248,0.35)] transition-all duration-300">
              {/* Light Mode Logo */}
              <Image
                src="/compassion.png"
                alt="Maitri Compassion Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain block dark:hidden drop-shadow-sm transition-transform duration-300"
                priority
              />
              {/* Dark Mode Logo */}
              <Image
                src="/light-compassion-v2.png"
                alt="Maitri Compassion Logo (Dark)"
                width={36}
                height={36}
                className="h-full w-full object-contain hidden dark:block scale-[1.08] drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-transform duration-300"
                priority
              />
            </div>
            <span className="bg-linear-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-[#38BDF8] dark:via-[#818CF8] dark:to-[#34D399] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
              Maitri
            </span>
          </Link>

          {/* desktop links with sliding pill */}
          <ul className="relative hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
            <span
              aria-hidden
              className="absolute inset-y-0 rounded-full bg-slate-200/80 dark:bg-white/10 transition-all duration-300 ease-[cubic-bezier(.3,.8,.3,1)]"
              style={{ left: pill.left, width: pill.width, opacity: pill.on ? 1 : 0 }}
            />
            {LINKS.map((l, i) => {
              const active = i === activeIndex;
              return (
                <li key={l.href} ref={(el) => { itemRefs.current[i] = el; }} className="relative">
                  <Link
                    href={l.href}
                    aria-current={active ? 'page' : undefined}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className={`relative block rounded-full px-5 py-2 text-[15px] font-semibold transition-colors ${focus} ${
                      active
                        ? 'text-sky-600 dark:text-[#22D3EE] font-bold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-[#B8C7E8] dark:hover:text-white'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* right actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle dark={dark} onToggle={toggleTheme} />

            {/* Auth State (Login button or Avatar Dropdown) */}
            {isPending ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-white/15" />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((p) => !p)}
                  title={user.name || 'User Profile'}
                  aria-label="User menu"
                  className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-sky-500/70 dark:border-[#00C6FF]/60 p-0.5 shadow-sm transition hover:scale-105 hover:border-sky-500 dark:hover:border-[#00C6FF] ${focus}`}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'Avatar'}
                      width={36}
                      height={36}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-indigo-600 dark:from-[#00C6FF] dark:to-[#7B61FF] text-xs font-bold text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0F1A3A]/95 p-2 shadow-2xl backdrop-blur-xl transition-all">
                    <div className="border-b border-slate-100 dark:border-white/10 px-3 py-2.5">
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{user.name}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-[#8EA0C4]">{user.email}</p>
                    </div>
                    <div className="mt-1 space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-[#E8F0FF] hover:bg-sky-50 dark:hover:bg-[#22D3EE]/15 transition-colors"
                      >
                        <User className="h-4 w-4 text-sky-500 dark:text-[#00B8D9]" /> My Profile
                      </Link>
                      <Link
                        href="/create-event"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-[#E8F0FF] hover:bg-sky-50 dark:hover:bg-[#22D3EE]/15 transition-colors"
                      >
                        <PlusCircle className="h-4 w-4 text-sky-500 dark:text-[#00B8D9]" /> Create Event
                      </Link>
                      <Link
                        href="/manage-events"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-[#E8F0FF] hover:bg-sky-50 dark:hover:bg-[#22D3EE]/15 transition-colors"
                      >
                        <CalendarDays className="h-4 w-4 text-sky-500 dark:text-[#00B8D9]" /> Manage Events
                      </Link>
                      <Link
                        href="/joined-events"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-[#E8F0FF] hover:bg-sky-50 dark:hover:bg-[#22D3EE]/15 transition-colors"
                      >
                        <CalendarCheck className="h-4 w-4 text-sky-500 dark:text-[#00B8D9]" /> Joined Events
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`group hidden items-center gap-2 rounded-full bg-linear-to-r from-sky-500 to-indigo-600 dark:from-[#3B6CFF] dark:to-[#7B61FF] px-5 py-2 text-sm font-bold text-white shadow-[0_6px_20px_-4px_rgba(59,108,255,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-4px_rgba(123,97,255,0.8)] sm:inline-flex ${focus}`}
              >
                <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Login
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`grid h-10 w-10 place-items-center rounded-full border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-[#E8F0FF] transition hover:border-sky-500 hover:bg-slate-200 dark:hover:border-[#00B8D9] dark:hover:bg-white/10 md:hidden ${focus}`}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* reading progress along the bottom edge */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
        <span
          className="block h-full origin-left bg-linear-to-r from-[#00C6FF] via-[#3B6CFF] to-[#7B61FF]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </span>

      {/* mobile panel */}
      <div
        id="mobile-menu"
        className={`w-full overflow-hidden border-t border-slate-200/80 dark:border-white/10 bg-white/98 dark:bg-[#070e20]/98 backdrop-blur-xl transition-all duration-300 md:hidden ${
          open ? 'max-h-96 opacity-100 py-3' : 'pointer-events-none max-h-0 border-transparent opacity-0 py-0'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ul className="space-y-1">
            {LINKS.map((l, i) => {
              const active = i === activeIndex;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${focus} ${
                      active
                        ? 'bg-sky-500/10 text-sky-600 dark:bg-white/10 dark:text-[#22D3EE]'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-[#B8C7E8] dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}

            {user ? (
              <>
                <li className="pt-2">
                  <Link
                    href="/create-event"
                    tabIndex={open ? 0 : -1}
                    className="block rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-[#B8C7E8] hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link
                    href="/manage-events"
                    tabIndex={open ? 0 : -1}
                    className="block rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-[#B8C7E8] hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    Manage Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/joined-events"
                    tabIndex={open ? 0 : -1}
                    className="block rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-[#B8C7E8] hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    Joined Events
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    tabIndex={open ? 0 : -1}
                    className="block w-full text-left rounded-xl px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    Logout ({user.name})
                  </button>
                </li>
              </>
            ) : (
              <li className="pt-2 sm:hidden">
                <Link
                  href="/login"
                  tabIndex={open ? 0 : -1}
                  className={`flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 dark:from-[#3B6CFF] dark:to-[#7B61FF] py-2.5 font-bold text-white shadow-md ${focus}`}
                >
                  <LogIn className="h-4 w-4" /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
