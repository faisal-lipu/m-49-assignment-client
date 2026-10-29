// ==============================================================
// BetterAuth Client Instance (Browser-Side)
// Used in React components to handle login, register, logout & sessions
// ==============================================================

import { createAuthClient } from "better-auth/react";

// Create the browser auth client
export const authClient = createAuthClient();

// Export helper hooks and functions for easy use across the app
export const { signUp, signIn, signOut, useSession, updateUser } = authClient;
