// ==============================================================
// BetterAuth API Route Handler
// Handles all authentication endpoints at /api/auth/*
// ==============================================================

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Export GET and POST handlers so Next.js App Router routes all BetterAuth requests
export const { GET, POST } = toNextJsHandler(auth);
