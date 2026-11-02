// ==============================================================
// BetterAuth Configuration (Server-Side)
// Connects to MongoDB Atlas using the official MongoDB adapter
// ==============================================================

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Connect to MongoDB Atlas for storing users and sessions in maitriDB
const dbUrl =
  process.env.BETTER_AUTH_DB_URL ||
  "mongodb+srv://foisaliftekharlipu_db_user:Lipunext12345@cluster0.qji0htb.mongodb.net/maitriDB?appName=Cluster0";

const client = new MongoClient(dbUrl);
const db = client.db("maitriDB");

// Determine the canonical base URL (ensures production live domain is used on Vercel)
const getBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("localhost")) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://m-49-assignment-client.vercel.app";
  }
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "maitri_better_auth_secret_key_2026",
  baseURL: getBaseUrl(),
  trustedOrigins: [
    "https://m-49-assignment-client.vercel.app",
    "http://localhost:3000",
  ],
  // Use MongoDB adapter so user accounts and sessions are saved in MongoDB Atlas
  database: mongodbAdapter(db, { client }),

  // 1. Enable Email & Password Authentication
  emailAndPassword: {
    enabled: true,
  },

  // 2. Enable Social Login Providers (Google) via Environment Variables
  socialProviders: {
    google: {
      clientId: (process.env.BETTER_AUTH_GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.BETTER_AUTH_GOOGLE_SECRET || "").trim(),
    },
  },

  // 3. Optional: Add extra user fields like image/photoURL and role
  user: {
    additionalFields: {
      image: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "volunteer",
      },
    },
  },
});
