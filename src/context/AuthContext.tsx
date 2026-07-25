import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  signOut,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  getDocs,
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

export interface UserSettings {
  notificationsEnabled?: boolean;
  darkModeEnabled?: boolean;
  dailyReminderTime?: string;
}

export interface UserProfileData {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  selectedUniversity?: string; // 'NED' | 'FAST' | etc.
  targetUniversities?: string[];
  mcqsAttempted?: number;
  correctAnswers?: number;
  accuracy?: number;
  streakDays?: number;
  lastActiveDate?: string;
  settings?: UserSettings;
  createdAt?: any;
}

export interface BookmarkItem {
  id: string; // doc ID
  userId: string;
  mcqId: string;
  question: string;
  subject: string;
  university: string;
  timestamp?: any;
}

export interface ActivityItem {
  id?: string;
  userId: string;
  title: string;
  type: 'practice' | 'mock' | 'ai-tutor';
  university: string;
  score?: number;
  total?: number;
  timestamp: any;
}

export interface MockTestRecord {
  id?: string;
  userId: string;
  university: string;
  subject: string;
  totalQuestions: number;
  difficulty: string;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  score: number;
  accuracy: number;
  timeSpentSeconds: number;
  subjectPerformance: Record<string, { total: number; correct: number; wrong: number; skipped: number }>;
  weakTopics: string[];
  strongTopics: string[];
  userAnswers: Record<string, string>;
  timestamp?: any;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AIChatSession {
  id: string;
  userId: string;
  title: string;
  messages: AIChatMessage[];
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  userProfile: UserProfileData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateSelectedUniversity: (uniId: string) => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfileData>) => Promise<void>;
  fetchBookmarks: () => Promise<BookmarkItem[]>;
  removeBookmarkById: (bookmarkDocId: string) => Promise<void>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  logActivity: (title: string, type: 'practice' | 'mock' | 'ai-tutor', university: string, score?: number, total?: number) => Promise<void>;
  recordQuestionAttempt: (attemptedCount: number, correctCount: number) => Promise<void>;
  toggleBookmarkMCQ: (mcq: { id: string; question: string; subject: string; universityId: string }) => Promise<boolean>;
  saveMockTestResult: (data: Omit<MockTestRecord, 'userId' | 'timestamp'>) => Promise<string | null>;
  saveAIChatSession: (chatId: string | null, title: string, messages: AIChatMessage[]) => Promise<string | null>;
  fetchAIChatSessions: () => Promise<AIChatSession[]>;
  deleteAIChatSession: (chatId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Real-time listener on user doc
        const userRef = doc(db, 'users', user.uid);
        unsubscribeDoc = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserProfile(snapshot.data() as UserProfileData);
          } else {
            // Create default profile if not present
            const defaultProfile: UserProfileData = {
              uid: user.uid,
              displayName: user.displayName || 'EntryAce Aspirant',
              email: user.email || '',
              photoURL: user.photoURL || '',
              selectedUniversity: 'NED',
              targetUniversities: ['NED', 'FAST'],
              mcqsAttempted: 0,
              correctAnswers: 0,
              accuracy: 0,
              streakDays: 5,
              lastActiveDate: new Date().toISOString().split('T')[0],
            };
            setDoc(userRef, {
              ...defaultProfile,
              createdAt: serverTimestamp(),
            }).catch(console.error);
            setUserProfile(defaultProfile);
          }
        }, (err) => {
          console.warn('Error fetching Firestore user profile:', err);
        });
      } else {
        setUserProfile(null);
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      
      // Store initial user record in Firestore
      const userRef = doc(db, 'users', res.user.uid);
      await setDoc(userRef, {
        uid: res.user.uid,
        displayName: name,
        email: email,
        selectedUniversity: 'NED',
        targetUniversities: ['NED', 'FAST'],
        mcqsAttempted: 0,
        correctAnswers: 0,
        accuracy: 0,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      });
    }
  };

  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      const userRef = doc(db, 'users', res.user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: res.user.uid,
          displayName: res.user.displayName || 'EntryAce Aspirant',
          email: res.user.email,
          photoURL: res.user.photoURL,
          selectedUniversity: 'NED',
          targetUniversities: ['NED', 'FAST'],
          mcqsAttempted: 0,
          correctAnswers: 0,
          accuracy: 0,
          streakDays: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp(),
        });
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateSelectedUniversity = async (uniId: string) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        selectedUniversity: uniId
      });
    } catch (err) {
      console.error('Error updating university:', err);
    }
  };

  const logActivity = async (title: string, type: 'practice' | 'mock' | 'ai-tutor', university: string, score?: number, total?: number) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'activities'), {
        userId: currentUser.uid,
        title,
        type,
        university,
        score: score || 0,
        total: total || 0,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  const recordQuestionAttempt = async (attemptedCount: number, correctCount: number) => {
    if (!currentUser || !userProfile) return;
    try {
      const newAttempted = (userProfile.mcqsAttempted || 0) + attemptedCount;
      const newCorrect = (userProfile.correctAnswers || 0) + correctCount;
      const newAccuracy = newAttempted > 0 ? parseFloat(((newCorrect / newAttempted) * 100).toFixed(1)) : 0;

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        mcqsAttempted: newAttempted,
        correctAnswers: newCorrect,
        accuracy: newAccuracy,
        lastActiveDate: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Error updating question attempt metrics:', err);
    }
  };

  const toggleBookmarkMCQ = async (mcq: { id: string; question: string; subject: string; universityId: string }) => {
    if (!currentUser) return false;
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', currentUser.uid),
        where('mcqId', '==', mcq.id)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Delete existing bookmark
        snapshot.forEach((d) => deleteDoc(doc(db, 'bookmarks', d.id)));
        return false;
      } else {
        // Add bookmark
        await addDoc(collection(db, 'bookmarks'), {
          userId: currentUser.uid,
          mcqId: mcq.id,
          question: mcq.question,
          subject: mcq.subject,
          university: mcq.universityId,
          timestamp: serverTimestamp(),
        });
        return true;
      }
    } catch (err) {
      console.error('Error toggling bookmark in Firestore:', err);
      return false;
    }
  };

  const saveMockTestResult = async (data: Omit<MockTestRecord, 'userId' | 'timestamp'>) => {
    if (!currentUser) return null;
    try {
      const docRef = await addDoc(collection(db, 'mockTests'), {
        ...data,
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
      });

      // Update total attempt counters in userProfile
      await recordQuestionAttempt(data.totalQuestions, data.correctAnswers);

      // Log in recent activities
      await logActivity(
        `${data.university} Mock Test (${data.subject})`,
        'mock',
        data.university,
        data.score,
        data.totalQuestions
      );

      return docRef.id;
    } catch (err) {
      console.error('Error saving mock test result in Firestore:', err);
      return null;
    }
  };

  const saveAIChatSession = async (chatId: string | null, title: string, messages: AIChatMessage[]) => {
    if (!currentUser) return null;
    try {
      if (chatId) {
        const docRef = doc(db, 'aiChats', chatId);
        await setDoc(docRef, {
          userId: currentUser.uid,
          title: title || 'EntryAce AI Tutor Session',
          messages,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        return chatId;
      } else {
        const docRef = await addDoc(collection(db, 'aiChats'), {
          userId: currentUser.uid,
          title: title || (messages.find(m => m.sender === 'user')?.text.slice(0, 32) || 'EntryAce AI Tutor Session'),
          messages,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return docRef.id;
      }
    } catch (err) {
      console.error('Error saving AI chat session in Firestore:', err);
      return null;
    }
  };

  const fetchAIChatSessions = async (): Promise<AIChatSession[]> => {
    if (!currentUser) return [];
    try {
      const q = query(
        collection(db, 'aiChats'),
        where('userId', '==', currentUser.uid),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const sessions: AIChatSession[] = [];
      snapshot.forEach((docSnap) => {
        sessions.push({
          id: docSnap.id,
          ...docSnap.data()
        } as AIChatSession);
      });
      return sessions;
    } catch (err) {
      console.error('Error fetching AI chat sessions from Firestore:', err);
      return [];
    }
  };

  const updateUserProfileData = async (data: Partial<UserProfileData>) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, data);

      if (data.displayName || data.photoURL) {
        await updateProfile(currentUser, {
          displayName: data.displayName || currentUser.displayName,
          photoURL: data.photoURL || currentUser.photoURL,
        });
      }
    } catch (err) {
      console.error('Error updating profile data:', err);
      throw err;
    }
  };

  const fetchBookmarks = async (): Promise<BookmarkItem[]> => {
    if (!currentUser) return [];
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const list: BookmarkItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...docSnap.data()
        } as BookmarkItem);
      });
      return list;
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      return [];
    }
  };

  const removeBookmarkById = async (bookmarkDocId: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'bookmarks', bookmarkDocId));
    } catch (err) {
      console.error('Error removing bookmark:', err);
      throw err;
    }
  };

  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        settings: {
          ...(userProfile?.settings || {}),
          ...settings
        }
      });
    } catch (err) {
      console.error('Error updating user settings:', err);
      throw err;
    }
  };

  const changePassword = async (newPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');
    await updatePassword(currentUser, newPassword);
  };

  const deleteAIChatSession = async (chatId: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'aiChats', chatId));
    } catch (err) {
      console.error('Error deleting AI chat session in Firestore:', err);
    }
  };

  const value = {
    currentUser,
    loading,
    userProfile,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    updateSelectedUniversity,
    updateUserProfileData,
    fetchBookmarks,
    removeBookmarkById,
    updateUserSettings,
    changePassword,
    logActivity,
    recordQuestionAttempt,
    toggleBookmarkMCQ,
    saveMockTestResult,
    saveAIChatSession,
    fetchAIChatSessions,
    deleteAIChatSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

