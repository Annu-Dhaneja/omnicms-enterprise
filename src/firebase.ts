import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

let app: any = null;
let db: any = null;
let auth: any = null;
let isFirebaseReady = false;
let firebaseConfigError: string | null = null;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApp();

    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseReady = true;

    console.log(
      "Firebase initialized:",
      firebaseConfig.projectId
    );
  } catch (error) {
    firebaseConfigError =
      error instanceof Error ? error.message : String(error);

    console.error(
      "Firebase initialization failed:",
      error
    );
  }
} else {
  firebaseConfigError =
    "Firebase environment variables are missing.";

  console.error(firebaseConfigError);
}

export {
  db,
  auth,
  isFirebaseReady,
  firebaseConfigError,
};

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
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
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const currentUser = auth?.currentUser as User | null;

  const errInfo: FirestoreErrorInfo = {
    error:
      error instanceof Error
        ? error.message
        : String(error),

    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified:
        currentUser?.emailVerified || null,
      isAnonymous:
        currentUser?.isAnonymous || null,
      tenantId:
        currentUser?.tenantId || null,

      providerInfo:
        currentUser?.providerData?.map(
          (provider) => ({
            providerId: provider.providerId,
            email: provider.email,
          })
        ) || [],
    },

    operationType,
    path,
  };

  console.error(
    "Firestore Error:",
    JSON.stringify(errInfo)
  );

  throw new Error(JSON.stringify(errInfo));
}

export async function logInWithGoogle() {
  if (!isFirebaseReady || !auth) {
    const mockUser = {
      uid: "mock_super_admin_667",
      email: "admin@example.com",
      displayName: "Seeker Admin",
      emailVerified: true,
      role: "Super Admin",
    };

    localStorage.setItem(
      "acharya_mock_admin_user",
      JSON.stringify(mockUser)
    );

    return mockUser;
  }

  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(
      auth,
      provider
    );

    return result.user;
  } catch (error) {
    console.error(
      "Google login failed:",
      error
    );

    throw error;
  }
}

export async function logOutUser() {
  localStorage.removeItem(
    "acharya_mock_admin_user"
  );

  if (!isFirebaseReady || !auth) {
    return;
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error(
      "Signout failed:",
      error
    );

    throw error;
  }
}
