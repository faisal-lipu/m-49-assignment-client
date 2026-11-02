'use client';

// ==============================================================
// Register Page (/register)
// Features: Full Name, Email, Password with real-time strength
// indicators, Confirm Password match, optional Photo URL with preview,
// Google Social Sign Up, and automatic JWT issuance for backend.
// ==============================================================

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Camera,
  Loader2,
  HeartHandshake,
  Building2,
} from 'lucide-react';
import { signUp, signIn } from '@/lib/auth-client';
import { issueServerJwt } from '@/lib/api';
import { toast } from 'sonner';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [role, setRole] = useState<'volunteer' | 'organizer' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Real-time password validation metrics
  const passwordChecks = useMemo(() => {
    return {
      hasMinLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      matchesConfirm: password.length > 0 && password === confirmPassword,
    };
  }, [password, confirmPassword]);

  const isPasswordValid =
    passwordChecks.hasMinLength &&
    passwordChecks.hasUppercase &&
    passwordChecks.hasLowercase;

  // Helper for password requirement line styling (#00a6f4 for met, Red for unmet)
  const getRequirementStyle = (isMet: boolean) => {
    if (isMet) {
      return {
        container:
          'bg-[#00a6f4]/10 border-[#00a6f4]/35 text-[#0077b6] dark:bg-[#00a6f4]/15 dark:border-[#00a6f4]/35 dark:text-[#38bdf8] font-semibold',
        icon: <CheckCircle2 className="w-4 h-4 text-[#00a6f4] shrink-0" />,
      };
    }
    if (passwordTouched || password.length > 0 || submitted) {
      return {
        container:
          'bg-rose-50/90 border-rose-500/40 text-rose-700 dark:bg-rose-950/40 dark:border-rose-400/40 dark:text-rose-300 font-semibold',
        icon: <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />,
      };
    }
    return {
      container:
        'bg-white/60 border-slate-200/70 text-slate-600 dark:bg-white/[0.02] dark:border-white/5 dark:text-slate-400',
      icon: <XCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />,
    };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMsg(null);

    // 1. Role validation (Volunteer vs Organizer)
    if (!role) {
      const msg = 'Please select either the Volunteer or Organizer role.';
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    // 2. Client-side field validations
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg(
        'Password must be at least 6 characters and contain at least one uppercase and one lowercase letter.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please agree to the Maitri Community Guidelines & Terms.');
      return;
    }

    setLoading(true);

    try {
      // 3. Call BetterAuth signup with role
      const result = await (signUp.email as any)({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoURL.trim() || undefined,
        role,
      });

      if (result.error) {
        setErrorMsg(result.error.message || 'Failed to create account.');
        toast.error(result.error.message || 'Failed to create account.');
        setLoading(false);
        return;
      }

      // 4. Save role to localStorage for app-wide role awareness
      if (typeof window !== 'undefined') {
        localStorage.setItem('maitri_user_role', role);
      }

      // 5. Sync JWT with Express backend
      await issueServerJwt(email.trim());

      toast.success(
        `Account created successfully! Welcome to Maitri as ${role === 'organizer' ? 'an Organizer' : 'a Volunteer'}.`
      );
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      console.error('Registration error:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Social Sign Up
  const handleGoogleSignUp = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      const res = await signIn.social({
        provider: 'google',
        callbackURL: callbackUrl,
      });

      if (res?.error) {
        console.error('Google sign up error:', res.error);
        const msg = res.error.message || 'Google sign up failed. Please try again.';
        setErrorMsg(msg);
        toast.error(msg);
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      console.error('Google sign up error:', err);
      const msg = err instanceof Error ? err.message : 'Google sign up failed.';
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join the Movement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2447] dark:text-[#E8F0FF] tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Become a volunteer or event organizer with Maitri today.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Volunteer vs Organizer Tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Register As <span className="text-rose-500">*</span>
              </label>
              {role && (
                <span className="text-[11px] font-semibold text-[#00a6f4] capitalize">
                  {role} selected
                </span>
              )}
            </div>
            <div
              className={`grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-[#081024] border transition-all ${
                submitted && !role
                  ? 'border-rose-500/80 ring-2 ring-rose-500/20'
                  : 'border-slate-200/80 dark:border-white/10'
              }`}
            >
              {/* Volunteer Tab */}
              <button
                type="button"
                onClick={() => {
                  setRole('volunteer');
                  if (errorMsg?.includes('Organizer') || errorMsg?.includes('role')) setErrorMsg(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  role === 'volunteer'
                    ? 'bg-white dark:bg-[#00a6f4] text-[#0077b6] dark:text-white shadow-md border border-[#00a6f4]/30 dark:border-transparent scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <HeartHandshake
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    role === 'volunteer' ? 'text-[#00a6f4] dark:text-white' : 'text-slate-400'
                  }`}
                />
                <span>Volunteer</span>
              </button>

              {/* Organizer Tab */}
              <button
                type="button"
                onClick={() => {
                  setRole('organizer');
                  if (errorMsg?.includes('Organizer') || errorMsg?.includes('role')) setErrorMsg(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  role === 'organizer'
                    ? 'bg-white dark:bg-[#00a6f4] text-[#0077b6] dark:text-white shadow-md border border-[#00a6f4]/30 dark:border-transparent scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <Building2
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    role === 'organizer' ? 'text-[#00a6f4] dark:text-white' : 'text-slate-400'
                  }`}
                />
                <span>Organizer</span>
              </button>
            </div>
            {submitted && !role && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                Please select either the Volunteer or Organizer role.
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Ahmed"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tanvir@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Optional Photo URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Profile Photo URL (Optional)
              </label>
              {photoURL && (
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-sky-400">
                  <Image
                    src={photoURL}
                    alt="Avatar preview"
                    fill
                    sizes="20px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>
            <div className="relative">
              <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordTouched(true);
                }}
                onBlur={() => {
                  if (password.length > 0) setPasswordTouched(true);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Re-Password) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
            </div>

            {/* Password Requirements - Always visible under Re-Password with dynamic #00a6f4 (met) and Red (unmet) */}
            <div className="mt-2.5 p-3 rounded-2xl bg-slate-50/90 dark:bg-[#081024] border border-slate-200/80 dark:border-white/10 space-y-2 text-xs shadow-xs">
              {/* Requirement Line 1: Uppercase */}
              {(() => {
                const style = getRequirementStyle(passwordChecks.hasUppercase);
                return (
                  <div
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 ${style.container}`}
                  >
                    {style.icon}
                    <span>At least one uppercase letter (A-Z)</span>
                  </div>
                );
              })()}

              {/* Requirement Line 2: Lowercase */}
              {(() => {
                const style = getRequirementStyle(passwordChecks.hasLowercase);
                return (
                  <div
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 ${style.container}`}
                  >
                    {style.icon}
                    <span>At least one lowercase letter (a-z)</span>
                  </div>
                );
              })()}

              {/* Requirement Line 3: Minimum 6 characters */}
              {(() => {
                const style = getRequirementStyle(passwordChecks.hasMinLength);
                return (
                  <div
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 ${style.container}`}
                  >
                    {style.icon}
                    <span>Minimum 6 characters length</span>
                  </div>
                );
              })()}

              {/* Password Matching Status */}
              {confirmPassword.length > 0 && (
                <div
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 ${
                    passwordChecks.matchesConfirm
                      ? 'bg-[#00a6f4]/10 border-[#00a6f4]/35 text-[#0077b6] dark:bg-[#00a6f4]/15 dark:border-[#00a6f4]/35 dark:text-[#38bdf8] font-semibold'
                      : 'bg-rose-50/90 border-rose-500/40 text-rose-700 dark:bg-rose-950/40 dark:border-rose-400/40 dark:text-rose-300 font-semibold'
                  }`}
                >
                  {passwordChecks.matchesConfirm ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00a6f4] shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  )}
                  <span>
                    {passwordChecks.matchesConfirm ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Agree to Terms Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-sky-500 focus:ring-sky-400 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400 leading-tight cursor-pointer">
              I agree to the{' '}
              <span className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                Maitri Community Guidelines
              </span>{' '}
              and volunteer safety terms.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>
                  {role === 'organizer'
                    ? 'Create Organizer Account'
                    : role === 'volunteer'
                    ? 'Create Volunteer Account'
                    : 'Create Account'}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-white dark:bg-[#0c1630] px-3 text-slate-400">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Google Social Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
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
          <span>Sign up with Google</span>
        </button>

        {/* Footer Link to Login */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>Already have an account? </span>
          <Link
            href={`/login${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            className="font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-0.5"
          >
            <span>Log in Now</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Safe, spam-free community platform powered by BetterAuth</span>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-16 sm:py-24 pro-container mx-auto">
      <Suspense
        fallback={
          <div className="text-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading registration form...</p>
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
