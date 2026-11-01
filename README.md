# Maitri (মৈত্রী) - Social Development Events Platform

> **A community-driven event management platform where citizens can discover, create, join, and track local social welfare drives.**

[![Live Site](https://img.shields.io/badge/Live_Site-Vercel-00C6FF?style=for-the-badge&logo=vercel)](https://m-49-assignment-client.vercel.app)
[![API Server](https://img.shields.io/badge/Server_API-Render-46E3B7?style=for-the-badge&logo=render)](https://m-49-assignment-server.onrender.com)
[![Next.js](https://img.shields.io/badge/Next.js_16-Turbopack-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-DaisyUI_5-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

---

## 🌐 Live URLs

* **Client Deployment (Vercel):** [https://m-49-assignment-client.vercel.app](https://m-49-assignment-client.vercel.app)
* **Server API (Render):** [https://m-49-assignment-server.onrender.com](https://m-49-assignment-server.onrender.com)
* **Client Repository:** [https://github.com/faisal-lipu/m-49-assignment-client](https://github.com/faisal-lipu/m-49-assignment-client)
* **Server Repository:** [https://github.com/faisal-lipu/m-49-assignment-server](https://github.com/faisal-lipu/m-49-assignment-server)

---

## ✨ Key Features

* **Real-time Event Discovery & Exploration:** Filter and discover volunteer drives with instant live title/location search, interactive category pills (Cleanup, Plantation, Donation, Food Relief, Healthcare, Education), sort controls, and switchable Grid/List layouts.
* **Interactive Event Details with Embedded Maps:** Comprehensive event briefs featuring live volunteer capacity gauges, days-left countdowns, verified organizer profiles, volunteer checklist guidelines, and embedded Google Maps for one-click venue navigation.
* **Organizer Studio with Strict Future Date Validation:** Authenticated organizers can publish community drives with auto-filled read-only credentials, live banner previews, and built-in calendar constraints preventing past event dates.
* **Full CRUD Management & SweetAlert2 Confirmations:** Dedicated organizer dashboard (`/manage-events`) to view personal events, update details via an interactive modal with date validation, and permanently delete events with SweetAlert2 security dialogs.
* **Volunteer Tracking & Impact Dashboard:** Registered members can view their joined events (`/joined-events`), review estimated community service hours (`~16h`), and safely release or cancel participation spots with real-time database sync.
* **Adaptive Dual Theme & Minimal Dot Matrix:** Flawless Light & Dark mode support featuring custom radial gradients, minimalist dot-matrix textures, zero side-gap navbar, reading progress bar, and high-contrast typography.
* **Robust Multi-Provider Authentication:** Powered by BetterAuth and MongoDB Adapter with Email/Password authentication, Google Social Login, real-time password strength validation, and custom unregistered user existence checks.

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Framework:** Next.js 16 (App Router with Turbopack)
* **Language:** TypeScript 5
* **Styling:** Tailwind CSS v4, DaisyUI v5, Custom CSS Tokens
* **Icons:** Lucide React
* **Feedback & Modals:** Sonner Toaster, SweetAlert2
* **Authentication Client:** BetterAuth React Client (`better-auth/react`)

### Backend (Server)
* **Runtime:** Node.js, Express.js
* **Database:** MongoDB Atlas Native Driver (`mongodb`)
* **Security & Auth:** JSON Web Tokens (JWT), HTTP-Only Cookies, CORS
* **Hosting:** Render Cloud Platform

---

## 🔑 Demo Examiner Accounts (1-Click Auto Fill Available on Login)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Organizer Account** | `organizer@maitri.org` | `Maitri2026!` |
| **Volunteer Account** | `volunteer@maitri.org` | `Maitri2026!` |

---

## 💻 Local Setup & Installation

### 1. Clone Repositories
```bash
git clone https://github.com/faisal-lipu/m-49-assignment-client.git
cd m-49-assignment-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SERVER_URL=https://m-49-assignment-server.onrender.com
NEXT_PUBLIC_API_URL=https://m-49-assignment-server.onrender.com/api
BETTER_AUTH_DB_URL=mongodb+srv://...
BETTER_AUTH_SECRET=maitri_better_auth_secret_key_2026
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.
