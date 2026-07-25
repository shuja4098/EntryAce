# Deployment Guide for Vercel & Cloud Hosting — EntryAce AI

This guide details how to deploy EntryAce AI to production platforms such as **Vercel**, **Render**, **Cloud Run**, or **Railway**.

---

## 🚀 Option 1: Deploying to Vercel (Client SPA + Vercel Serverless Functions)

### Step 1: Push Repository to GitHub
Ensure your repository is pushed to GitHub:
```bash
git add .
git commit -m "Prepare EntryAce AI for Vercel deployment"
git push origin main
```

### Step 2: Import Project in Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New... > Project**.
3. Import your `entryace-ai` repository.

### Step 3: Framework Preset & Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Add Environment Variables in Vercel
Under **Environment Variables**, add:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `VITE_FIREBASE_API_KEY`: Your Firebase web API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase Auth domain
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your messaging sender ID
- `VITE_FIREBASE_APP_ID`: Your Firebase web app ID

### Step 5: Deploy
Click **Deploy**. Vercel will build the frontend assets and host the application.

---

## 🐳 Option 2: Full-Stack Docker / Cloud Run Deployment

For containerized environments running Express (`server.ts`):

### Step 1: Build Docker Container
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

### Step 2: Deploy to Google Cloud Run
```bash
gcloud run deploy entryace-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_key"
```
