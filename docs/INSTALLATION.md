# Installation & Local Setup Guide — EntryAce AI

This guide walks you through setting up EntryAce AI on your local development machine.

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later
- **Git**

---

## 🚀 Step-by-Step Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/entryace-ai.git
cd entryace-ai
```

### Step 2: Install Dependencies
Install all required npm packages:
```bash
npm install
```

### Step 3: Environment Setup
Copy `.env.example` to create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Open `.env` and configure the following parameters:
```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Web App Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 4: Run Development Server
Run the local dev server:
```bash
npm run dev
```

The application will start on `http://localhost:3000`.

---

## 🛠️ Available Scripts

- `npm run dev`: Starts Express + Vite development server on port 3000.
- `npm run build`: Bundles the client app with Vite and compiles `server.ts` to `dist/server.cjs`.
- `npm run start`: Runs the compiled production server (`node dist/server.cjs`).
- `npm run lint`: Runs TypeScript compiler to verify type safety across the project.
