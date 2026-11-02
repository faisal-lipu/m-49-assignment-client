'use client';

// ==============================================================
// NewsletterSection Component
// Weekly digest subscription with interactive topic filter chips,
// responsive email input, loading/done feedback, and floating sample digest card.
// ==============================================================

import { useState } from 'react';
import { Send, Check, Mail, CalendarClock, HeartPulse, HandHeart, Users, Leaf, Loader2 } from 'lucide-react';

const TOPICS = [
  { id: 'volunteering', label: 'Volunteering', Icon: HandHeart },
  { id: 'medical', label: 'Medical relief', Icon: HeartPulse },
  { id: 'community', label: 'Community events', Icon: Users },
  { id: 'environment', label: 'Environment', Icon: Leaf },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Sample newsletter items for interactive preview card */
const DIGEST = [
  { c: '#2DE2C0', tag: 'Volunteering', text: 'Riverside cleanup needs 16 more hands this Saturday' },
  { c: '#FF6B9A', tag: 'Medical relief', text: 'O-negative donors needed urgently in Dhanmondi' },
  { c: '#7B61FF', tag: 'Community', text: 'Winter clothes drive opens on Friday at Mirpur 10' },
];

// Simulated subscription API handler for demonstration purposes
async function fakeSubscribe() {
  await new Promise((r) => setTimeout(r, 900));
}

export interface NewsletterSectionProps {
  onSubscribe?: (data: { email: string; topics: string[] }) => Promise<void>;
}

export default function NewsletterSection({ onSubscribe = fakeSubscribe }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [picked, setPicked] = useState<string[]>(['volunteering', 'community']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle'); // idle | loading | done
  const [error, setError] = useState('');

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) return setError('Enter a valid email address, like name@example.com.');
    if (picked.length === 0) return setError('Pick at least one topic so we know what to send.');
    setError('');
    setStatus('loading');
    try {
      await onSubscribe({ email: email.trim(), topics: picked });
      setStatus('done');
    } catch {
      setStatus('idle');
      setError('Could not subscribe right now. Please try again in a moment.');
    }
  }

  return (
    <section id="newsletter" className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-center overflow-hidden bg-[#F2FBFF] py-6 lg:py-8 text-[#0B2447] dark:bg-[#0A1128] scroll-mt-20">
      <style>{`
        @keyframes mt-float{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-8px) rotate(var(--r,0deg))}}
        @keyframes mt-flow{to{stroke-dashoffset:-60}}
        @keyframes mt-fly{0%,100%{transform:translate(0,0) rotate(-10deg)}50%{transform:translate(8px,-6px) rotate(-3deg)}}
        .mt-float{animation:mt-float 7s ease-in-out infinite}
        .mt-flow{animation:mt-flow 3s linear infinite}
        .mt-fly{animation:mt-fly 4s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){.mt-float,.mt-flow,.mt-fly{animation:none}}
      `}</style>

      <div className="pro-container">
        <div className="relative mx-auto overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#3B6CFF] via-[#5B6CFF] to-[#00C6FF] shadow-[0_30px_60px_-20px_rgba(59,108,255,0.6)] dark:from-[#1E3A8A] dark:via-[#4C3FCF] dark:to-[#0891B2] dark:shadow-[0_0_60px_-15px_rgba(34,211,238,0.3)]">
        {/* decoration */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1.4px)', backgroundSize: '24px 24px', maskImage: 'linear-gradient(120deg, transparent 30%, #000 90%)', WebkitMaskImage: 'linear-gradient(120deg, transparent 30%, #000 90%)' }} />
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#7B61FF]/45 blur-[80px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-[#2DE2C0]/25 blur-[80px]" />
        <svg aria-hidden viewBox="0 0 600 120" className="pointer-events-none absolute left-0 top-0 hidden h-20 w-full text-white/35 lg:block" fill="none" preserveAspectRatio="none">
          <path className="mt-flow" d="M0 100 C 150 10, 300 130, 600 20" stroke="currentColor" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round" />
        </svg>

        <div className="relative grid items-center gap-6 p-5 text-white sm:p-7 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          {/* ---------- left ---------- */}
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <span className="mt-fly grid h-10 w-10 place-items-center rounded-xl border border-white/30 bg-white/15 backdrop-blur-xl" aria-hidden>
                <Send className="h-4.5 w-4.5" />
              </span>
              <span className="text-xs font-semibold tracking-wide uppercase text-white/80">Weekly Newsletter</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-[1.12] tracking-tight">
              Good news, once a week.
            </h2>
            <p className="mt-1.5 max-w-lg text-xs sm:text-sm leading-relaxed text-white/90">
              Verified volunteering opportunities, urgent medical relief requests and community events, sent straight to your inbox every Saturday.
            </p>

            {status === 'done' ? (
              <div className="mt-4 max-w-lg rounded-2xl border border-white/30 bg-white/15 p-4 backdrop-blur-xl" role="status">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2DE2C0] text-[#06161C]"><Check className="h-5 w-5" /></span>
                <p className="mt-3 text-lg font-bold">You’re on the list.</p>
                <p className="mt-1 text-xs text-white/90">
                  Your first issue arrives this Saturday at <span className="font-semibold">{email}</span>. We’ll cover{' '}
                  {picked.map((id) => TOPICS.find((t) => t.id === id)?.label.toLowerCase()).filter(Boolean).join(', ')}.
                </p>
                <button onClick={() => { setStatus('idle'); setEmail(''); }} className="mt-3 text-xs font-bold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-3.5 max-w-lg">
                <fieldset>
                  <legend className="mb-2 text-xs font-semibold text-white/90">What should we send you?</legend>
                  <div className="flex flex-wrap gap-1.5">
                    {TOPICS.map(({ id, label, Icon }) => {
                      const on = picked.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(id)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${on ? 'border-white bg-white text-[#3B2FCF]' : 'border-white/40 bg-white/10 text-white hover:bg-white/20'}`}
                        >
                          {on ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-3.5 flex flex-col gap-2.5 sm:flex-row">
                  <div className="relative flex-1">
                    <label htmlFor="nl-email" className="sr-only">Email address</label>
                    <Mail aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3B6CFF]" />
                    <input
                      id="nl-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={!!error}
                      aria-describedby={error ? 'nl-error' : undefined}
                      className="w-full rounded-xl border-2 border-transparent bg-white py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-[#0B2447] placeholder:text-[#7487A8] focus:border-[#2DE2C0] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0B2447] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#06142B] disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                  >
                    {status === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing</> : <>Subscribe <Send className="h-3.5 w-3.5" /></>}
                  </button>
                </div>
                {error && <p id="nl-error" role="alert" className="mt-2 rounded-lg bg-[#0B2447]/50 px-3 py-1.5 text-xs font-semibold">{error}</p>}
                <p className="mt-2 text-[11px] text-white/80">No spam. Unsubscribe with one click, anytime.</p>
              </form>
            )}
          </div>

          {/* ---------- right: digest preview ---------- */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none lg:pl-3">
            <div className="mt-float rounded-2xl bg-white p-4 text-[#0B2447] shadow-[0_25px_50px_-15px_rgba(6,20,43,0.55)] dark:bg-[#131C3A] dark:text-[#E8F0FF]" style={{ '--r': '2deg', transform: 'rotate(2deg)' } as React.CSSProperties}>
              <div className="flex items-center justify-between border-b border-dashed border-[#D6F3FA] pb-2.5 dark:border-white/10">
                <div>
                  <p className="text-base font-extrabold leading-tight">Maitri Weekly</p>
                  <p className="text-[11px] text-[#35507A] dark:text-[#8EA0C4]">A peek at a sample issue</p>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#00C6FF] to-[#7B61FF] text-white"><Mail className="h-4 w-4" /></span>
              </div>
              <ul className="mt-2.5 space-y-2">
                {DIGEST.map((d) => (
                  <li key={d.tag} className="flex gap-2.5 rounded-xl bg-[#F2FBFF] p-2.5 dark:bg-[#0D1A33]">
                    <span className="w-1.5 shrink-0 rounded-full" style={{ background: d.c }} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: d.c }}>{d.tag}</p>
                      <p className="mt-0.5 text-xs font-semibold leading-snug">{d.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur-xl">
                <CalendarClock className="h-3.5 w-3.5" /> Lands every Saturday morning
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
