'use client';

// ==============================================================
// Login Page (/login)
// Features: Email & Password sign-in, Google Social Login,
// One-click Demo Credentials fill (for examiners), Show/Hide
// Password toggle, Sonner notifications, and redirect with callbackUrl.
// ==============================================================

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
  UserCheck,
} from 'lucide-react';
import { signIn } from '@/lib/auth-client';
import { issueServerJwt } from '@/lib/api';
import { toast } from 'sonner';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // One-click demo credentials fill
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
    toast.info(`Filled demo account: ${demoEmail}`);
  };

  // Handle standard email + password login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Check if an account already exists with this email
      const checkRes = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const checkData = await checkRes.json();

      // If account does NOT exist: notify via toast & redirect to Register page
      if (checkData && checkData.exists === false) {
        setLoading(false);
        setErrorMsg('No account found with this email. Redirecting to registration page...');
        toast.error('No account found with this email! Please register first.', {
          duration: 4000,
        });

        setTimeout(() => {
          router.push(
            `/register${
              callbackUrl !== '/'
                ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : ''
            }`
          );
        }, 1200);
        return;
      }

      // 2. Account exists: Attempt sign-in with email & password
      const result = await signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        // Password or credentials incorrect: stay on login page as before
        setErrorMsg('Invalid email or password. Please try again.');
        toast.error('Incorrect password. Please verify your credentials and try again.');
        setLoading(false);
        return;
      }

      // 3. Login successful: Sync JWT token with Express backend
      await issueServerJwt(email.trim());

      toast.success('Welcome back! Signed in successfully.');
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      console.error('Login error:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Social Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: callbackUrl,
      });
    } catch (err: unknown) {
      console.error('Google sign in error:', err);
      const msg = err instanceof Error ? err.message : 'Google sign in failed.';
      setErrorMsg(msg);
      toast.error(msg);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* ----------------------------------------------------------- */}
      {/* Card Wrapper */}
      {/* ----------------------------------------------------------- */}
      <div className="bg-white/90 dark:bg-[#0c1630]/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maitri Secure Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2447] dark:text-[#E8F0FF] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Sign in to organize and join verified community drives.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Pill Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-sky-50/60 dark:bg-white/5 border border-sky-200/60 dark:border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-sky-500" />
              Demo Examiner Accounts:
            </span>
            <span className="text-[10px] text-slate-400">1-Click Auto-Fill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('organizer@maitri.org', 'Maitri2026!')}
              className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#081024] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-sky-500 transition-all text-center cursor-pointer shadow-2xs"
            >
              Organizer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('volunteer@maitri.org', 'Maitri2026!')}
              className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#081024] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-sky-500 transition-all text-center cursor-pointer shadow-2xs"
            >
              Volunteer Demo
            </button>
          </div>
        </div>

        {/* Google Social Login */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 hover:bg-slate-100 dark:bg-[#081024] dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-white dark:bg-[#0c1630] px-3 text-slate-400">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Error Message Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>Don&apos;t have an account yet? </span>
          <Link
            href={`/register${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            className="font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-0.5"
          >
            <span>Create one now</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>End-to-end encrypted session with BetterAuth & MongoDB Atlas</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="text-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading authentication form...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
