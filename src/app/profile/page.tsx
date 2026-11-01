'use client';

// ==============================================================
// User Profile Page (/profile) [Optional Feature Requirement]
// Allows logged-in users to view and update their name and profile picture.
// ==============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Mail,
  Camera,
  Save,
  ShieldCheck,
  CalendarCheck,
  CalendarPlus,
  Loader2,
  Lock,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { useSession, updateUser } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: session, isPending: isSessionLoading } = useSession();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setImage(session.user.image || '');
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (res.error) {
        throw new Error(res.error.message || 'Failed to update profile.');
      }

      toast.success('Profile updated successfully!');
    } catch (err: unknown) {
      console.error('Update profile error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-20 px-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500 mb-4" />
        <h2 className="text-lg font-bold text-[#0B2447] dark:text-[#E8F0FF]">
          Loading Your Profile...
        </h2>
        <p className="text-xs text-slate-400 mt-1">Please wait a moment.</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white/90 dark:bg-[#0c1630]/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#0B2447] dark:text-[#E8F0FF] mb-2">
            Sign In Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Please sign in to view and customize your volunteer profile.
          </p>
          <div className="space-y-3">
            <Link
              href="/login?callbackUrl=/profile"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Continue</span>
            </Link>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium text-xs transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300 shadow-sm mb-3">
          <User className="w-3.5 h-3.5" />
          <span>Volunteer Account</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B2447] dark:text-[#E8F0FF] tracking-tight">
          My Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Update your display name and profile avatar across community drives.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white/90 dark:bg-[#0c1630]/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 shadow-xl">
        {/* Avatar Overview */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100 dark:border-white/5 mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-sky-500/40 shadow-lg bg-gradient-to-br from-sky-400 to-indigo-600 shrink-0 flex items-center justify-center text-white font-extrabold text-3xl">
            {image ? (
              <Image
                src={image}
                alt="Profile photo"
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <span>{(name || 'U')[0].toUpperCase()}</span>
            )}
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#0B2447] dark:text-[#E8F0FF] truncate">
              {session.user.name || 'Community Member'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {session.user.email}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Verified Volunteer
              </span>
              <Link
                href="/joined-events"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
              >
                <CalendarCheck className="w-3 h-3" />
                My Drives
              </Link>
              <Link
                href="/create-event"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
              >
                <CalendarPlus className="w-3 h-3" />
                Create Drive
              </Link>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-5">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#0B2447] dark:text-[#E8F0FF] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                disabled
                value={session.user.email}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#081024]/60 text-slate-500 dark:text-slate-400 text-xs sm:text-sm cursor-not-allowed"
              />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" title="Email is locked" />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Account email is verified with MongoDB Atlas and cannot be modified directly.
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#0B2447] dark:text-[#E8F0FF] mb-1.5">
              Display Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Profile Photo URL */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#0B2447] dark:text-[#E8F0FF] mb-1.5">
              Profile Photo URL
            </label>
            <div className="relative">
              <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#081024] text-[#0B2447] dark:text-[#E8F0FF] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-medium"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Provide an image URL (Unsplash or any public link) to update your volunteer avatar.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Profile Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
