// ==============================================================
// BetterAuth Configuration (Server-Side)
// Connects to MongoDB Atlas using the official MongoDB adapter
// ==============================================================

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Connect to MongoDB Atlas for storing users and sessions in maitriDB
const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string);
const db = client.db("maitriDB");

export const auth = betterAuth({
  // Use MongoDB adapter so user accounts and sessions are saved in MongoDB Atlas
  database: mongodbAdapter(db, { client }),

  // 1. Enable Email & Password Authentication
  emailAndPassword: {
    enabled: true,
  },

  // 2. Enable Social Login Providers (Google)
  socialProviders: {
    google: {
      clientId: (process.env.BETTER_AUTH_GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.BETTER_AUTH_GOOGLE_SECRET || "").trim(),
    },
  },

  // 3. Optional: Add extra user fields like image/photoURL
  user: {
    additionalFields: {
      image: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
});
