import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "acharya-khurana-cms-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
  firestoreDatabaseId: "default"
};

let app;
let db: any = null;
let auth: any = null;
let isFirebaseReady = false;

// Check if credentials are present (not empty values)
if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.projectId !== "acharya-khurana-cms-demo") {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || 'default');
    auth = getAuth(app);
    isFirebaseReady = true;
    console.log("Firebase initialized successfully with cloud project: ", firebaseConfig.projectId);
  } catch (error) {
    console.warn("Failed to initialize Firebase SDK, falling back to Local Storage CMS Engine:", error);
  }
} else {
  console.log("Empty or demo credentials detected. Using Local Storage CMS Engine.");
}

export { db, auth, isFirebaseReady };

// Connection testing as per Firebase integration instructions
export async function testConnection() {
  if (!isFirebaseReady || !db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Verified Firebase live database connection successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.", error);
    }
  }
}

// Error handling helper as per Firebase integration guideline
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = auth?.currentUser as User | null;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Occurred: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Google Login Helper
export async function logInWithGoogle() {
  if (!isFirebaseReady || !auth) {
    // Return mock logged-in user in mock mode
    const mockUser = {
      uid: "mock_super_admin_667",
      email: "kanika9694@gmail.com",
      displayName: "Seeker Admin",
      emailVerified: true,
      role: "Super Admin"
    };
    localStorage.setItem("acharya_mock_admin_user", JSON.stringify(mockUser));
    return mockUser;
  }
  
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google login failed via Firebase Auth SDK:", error);
    throw error;
  }
}

// Logout Helper
export async function logOutUser() {
  localStorage.removeItem("acharya_mock_admin_user");
  if (!isFirebaseReady || !auth) {
    return;
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Signout failed via Firebase Auth SDK:", error);
    throw error;
  }
}
