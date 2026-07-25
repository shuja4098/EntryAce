# EntryAce AI — Premier AI-Powered University Entry Test Prep Platform

EntryAce AI is a full-stack web application designed for students preparing for engineering and technology university entrance exams (such as **NED University**, **FAST-NUCES**, **NUST**, **GIKI**, and **UET**). Powered by **Google Gemini 2.5 AI** and **Firebase Firestore**, EntryAce AI delivers adaptive mock tests, instant AI tutoring, real-time merit percentile tracking, bookmarked question banks, and gamified progress achievements.

---

## 🌟 Key Features

1. **AI Tutor (Gemini 2.5 Flash)**
   - Context-aware step-by-step problem explanations.
   - Interactive Q&A with memory of previous test attempts.
   - Prompt shortcuts for formula breakdowns, quick memory tricks, and concept simplifications.

2. **Real-time Practice & Question Bank**
   - High-yield past paper MCQs for Mathematics, Physics, Chemistry, English, and IQ/Analytical Reasoning.
   - Immediate feedback with detailed explanations and formula references.
   - MCQ bookmarking with one-click saving to persistent Firestore storage.

3. **Timed University Mock Tests**
   - Exam simulation modeled after actual NED & FAST pattern exams.
   - Live timer, question status palette, and instant score analysis with speed breakdown.

4. **User Profile, Settings & Saved Bookmarks**
   - Custom avatars, full name, target university selection, and study streak tracking.
   - View, filter by subject, and remove saved MCQs.
   - Password reset/change, notifications toggle, and dark mode preferences.

5. **Gamified Achievements & Merit Badges**
   - Earn badges like *Beginner Aspirant*, *Fast Learner*, *Mock Test Master*, *AI Explorer*, and *Consistency Champion*.

---

## 📁 Repository Structure

```
EntryAce-AI/
├── docs/                      # Comprehensive deployment & setup guides
│   ├── INSTALLATION.md         # Local development setup guide
│   ├── FIREBASE_SETUP.md       # Firebase Firestore & Auth integration guide
│   ├── GEMINI_SETUP.md         # Gemini 2.5 API integration guide
│   ├── DEPLOYMENT_VERCEL.md    # Production deployment guide for Vercel
│   └── PRODUCTION_CHECKLIST.md # Deployment readiness checklist
├── public/                    # Static public assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Auth/              # Login, Signup, Password Reset & ProtectedRoute
│   │   ├── Practice/          # Interactive MCQ Practice Module
│   │   ├── MockTest/          # Timed Exam Simulator & Analytics
│   │   ├── Profile/           # Profile, Settings, Bookmarks & Achievements
│   │   ├── AITutor.tsx        # Gemini AI Assistant component
│   │   ├── Dashboard.tsx      # Student Analytics & Merit Leaderboard
│   │   ├── FloatingAskAI.tsx  # Quick AI helper widget
│   │   ├── Footer.tsx         # Platform footer
│   │   ├── HeroIllustration.tsx
│   │   ├── LandingPage.tsx    # Responsive marketing homepage
│   │   └── Navbar.tsx         # Responsive top navigation bar
│   ├── context/
│   │   └── AuthContext.tsx    # Firebase Auth & Firestore sync state engine
│   ├── data/
│   │   ├── questions.ts       # Entrance exam MCQ dataset
│   │   ├── testimonials.ts    # Student success reviews
│   │   └── universities.ts   # University criteria & pattern configs
│   ├── lib/
│   │   ├── firebase.ts        # Firebase app initialization
│   │   └── gemini.ts          # Server & Client Gemini API client
│   ├── App.tsx                # Main app router with ProtectedRoute rules
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global Tailwind CSS imports
├── server.ts                  # Node.js / Express backend server
├── firestore.rules            # Firebase Firestore security rules
├── firebase-blueprint.json    # Firestore schema specification
├── metadata.json              # Platform metadata configuration
├── package.json               # Node.js dependencies & scripts
├── vite.config.ts             # Vite build configuration
├── .env.example               # Environment variables specification
└── README.md                  # Main documentation
```

---

## 🛠️ Tech Stack & Prerequisites

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend/API**: Express.js, Node.js, `@google/genai` (Gemini SDK)
- **Database & Auth**: Firebase Firestore & Firebase Auth
- **Build Tool**: Vite, `esbuild`

---

## ⚡ Quick Start (Local Setup)

1. **Clone Repository & Install Dependencies**:
   ```bash
   git clone https://github.com/your-username/entryace-ai.git
   cd entryace-ai
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Google Gemini API key and Firebase credentials.

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📚 Detailed Documentation Guides

For step-by-step setup and deployment details, view the files in the `/docs` directory:
- [Installation Guide](./docs/INSTALLATION.md)
- [Firebase Setup Guide](./docs/FIREBASE_SETUP.md)
- [Gemini API Setup Guide](./docs/GEMINI_SETUP.md)
- [Vercel Deployment Guide](./docs/DEPLOYMENT_VERCEL.md)
- [Production Checklist](./docs/PRODUCTION_CHECKLIST.md)

---

## 🔒 Security & Firestore Rules

All user profile data, test history, and bookmarks are protected by Firestore security rules requiring user authentication (`request.auth != null`). View [`firestore.rules`](./firestore.rules) for full specification.
