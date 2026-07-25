import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfigData from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfigData);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app, firebaseConfigData.firestoreDatabaseId || "(default)");

export default app;
