# Firebase Setup Guide — EntryAce AI

EntryAce AI relies on **Firebase Authentication** (Email/Password & Google Sign-In) and **Cloud Firestore** for data persistence.

---

## 🛠️ Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**, enter a project name (e.g. `entryace-ai-prod`), and follow the prompt steps.
3. Once the project is created, click the **Web icon (`</>`)** to add a Web App.
4. Register the app name and copy your Firebase SDK configuration keys.

---

## 🔒 Step 2: Enable Firebase Authentication

1. In the Firebase Console sidebar, navigate to **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - Enable **Email/Password**.
   - Enable **Google** (Select your project support email).

---

## 🗄️ Step 3: Provision Firestore Database

1. Navigate to **Build > Firestore Database**.
2. Click **Create database**.
3. Select a location near your target users (e.g., `asia-south1` or `us-central1`).
4. Start in **Production Mode**.

---

## 🛡️ Step 4: Deploy Firestore Security Rules

Copy the rules from [`firestore.rules`](../firestore.rules) into the **Rules** tab in the Firebase Console and click **Publish**:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Activity records
    match /activities/{activityId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Bookmarks records
    match /bookmarks/{bookmarkId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Mock test records
    match /mockTests/{mockTestId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // AI Chat records
    match /aiChats/{chatId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

  }
}
```

---

## ⚡ Step 5: Configure Local Environment Variables

Paste your web app credentials into your `.env` or deployment environment config:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=entryace-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=entryace-ai
VITE_FIREBASE_STORAGE_BUCKET=entryace-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```
