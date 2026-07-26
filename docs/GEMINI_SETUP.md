# Gemini API Setup Guide — EntryAce AI

EntryAce AI leverages **Google Gemini 2.5 Flash** via the official `@google/genai` TypeScript SDK to provide step-by-step entry test tutoring, question explanations, and study hints.

---

## 🔑 Step 1: Obtain a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Log in with your Google Account.
3. Click **Get API key** in the left sidebar.
4. Click **Create API key in new project** or select an existing Google Cloud project.
5. Copy your generated API key (starts with `AIzaSy...`).

---

## 🔐 Step 2: Configure Server-Side Environment Variable

To keep your Gemini API key secure and prevent exposure in browser bundles, EntryAce AI routes AI Tutor requests through a server-side endpoint (`/api/ai/chat`).

Add your key to `.env` or your hosting provider's secrets panel:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

---

## 🤖 Step 3: Server Implementation Details

The backend server initialisation uses `@google/genai`:

```typescript
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Example model call:
const response = await ai.models.generateContent({
  model: 'gemini-2.0-flash-lite"',
  contents: 'Explain calculus integration for university entry tests.'
});
```

---

## ⚡ Step 4: Testing Gemini AI locally

1. Ensure `GEMINI_API_KEY` is set in `.env`.
2. Run `npm run dev`.
3. Open EntryAce AI in your browser and navigate to **AI Tutor (Gemini)**.
4. Send a prompt or click one of the quick prompt cards (e.g., *"Explain NED Past Paper Math Questions"*).
