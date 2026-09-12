# ⚡ NEXUS PROTOCOL — Life RPG Engine

> Transform mundane real-world habits and productivity tasks into an immersive, cyberpunk virtual progression system with non-linear XP leveling, attribute matrices, streak chains, and an in-game Black Market economy.

---

## 🎮 The Core Concept

Traditional productivity tools suffer from a **delayed gratification** problem: the real-world results of reading, working out, or coding take months to materialize.

**NEXUS PROTOCOL** bridges this dopamine gap by engineering immediate positive feedback loops:
- **Instant Dopamine**: Completing a mission awards dynamic Data Fragments (XP) and Credits (₡) with particle bursts and sound feedback.
- **System Upgrade (Level Up)**: A non-linear leveling formula requires exponentially more XP per level, preventing trivial grinding and rewarding true long-term commitment.
- **Neural Pathways (Attributes)**: Missions map directly to 6 core character stats:
  - ⚔️ **Strength**: Physical workouts, fitness, athletics
  - 🧠 **Intellect**: Coding, reading, technical mastery, learning
  - 🎯 **Discipline**: Deep work blocks, meditation, focus sessions
  - 💚 **Vitality**: Sleep hygiene, nutrition, hydration
  - ✨ **Charisma**: Public speaking, networking, social connections
  - 🎨 **Creativity**: Writing, design, artistic endeavors
- **Uplink Chains (Streaks)**: Consecutive active days build a streak multiplier (up to 2.0x XP yield).
- **Black Market (Economy)**: Spend earned credits on cybernetic implants, badges, titles, and custom interface cosmetics.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14+ (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion, Vanilla CSS Design System |
| **Icons** | Lucide React |
| **Audio** | Native Web Audio API (Synthesized 8-bit cyber chords, zero asset lag) |
| **Backend & Auth** | Supabase (PostgreSQL, Row Level Security, Auth, RPC Functions) |
| **Offline Resilience** | Automatic local demo state machine with localStorage persistence |
| **SEO** | Semantic HTML, OpenGraph tags, dynamic sitemap.xml & robots.txt |

---

## 🚀 Quick Start Guide

### 1. Clone & Install
```bash
# Navigate to project directory
cd nexus-protocol

# Install dependencies
npm install
```

### 2. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://jrowwgkkuqkhqxofayhf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
*(Get your anon key from your [Supabase API Settings](https://supabase.com/dashboard/project/jrowwgkkuqkhqxofayhf/settings/api))*

> **Note**: If you run without `.env.local`, the application **automatically launches in Zero-Config Demo Mode** with local state persistence so you can evaluate the experience immediately!

### 3. Database Migration (Supabase)
Your Supabase project runs the existing schema:
1. Open the **SQL Editor** in your Supabase dashboard at [supabase.com](https://supabase.com).
2. The schema and RPC functions (`complete_task`, `purchase_item`) are defined in `supabase/migrations/001_initial_schema.sql`.
3. All tables (`profiles`, `tasks`, `task_logs`, `shop_items`, `inventory`, `achievements`, `user_achievements`) and Row Level Security (RLS) policies protect user records automatically!

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📐 Progression Mathematics

### Non-Linear Leveling Formula
$$\text{XP to level } N = \left\lfloor 100 \times 1.5^{(N-1)} \right\rfloor$$

- Level 1 → 2: `100 XP`
- Level 2 → 3: `150 XP`
- Level 3 → 4: `225 XP`
- Level 5 → 6: `506 XP`
- Level 10 → 11: `3,844 XP`

### Streak Multiplier Formula
$$\text{Multiplier} = \min(1 + \text{streak} \times 0.1, 2.0)$$

---

## 🛡️ Anti-Cheat & Security
- **Row Level Security (RLS)**: Users can only query and mutate their own profile, tasks, and inventory rows.
- **Server-Side Functions (`complete_task`)**: XP and credits are calculated server-side in PostgreSQL stored procedures rather than directly accepting client state mutations.

---

## ♿ Accessibility & Responsiveness
- **Keyboard Navigation**: Full Tab/Shift+Tab focus outlines, ESC key modal traps, Enter/Space activation.
- **Screen Reader Support**: ARIA attributes (`role="progressbar"`, `aria-live="polite"`, `aria-modal="true"`).
- **Responsive Design**: Flawless layouts from mobile (375px) to desktop (1920px).
