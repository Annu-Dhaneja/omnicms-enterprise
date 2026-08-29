import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import {
  getFirestore,
  enableNetwork,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

let app;
let db: any = null;
let auth: any = null;
let isFirebaseReady = false;
let firebaseConfigError: string | null = null;

try {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error(
      "Firebase configuration is missing. Check VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID."
    );
  }

  app = getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

  auth = getAuth(app);

  db = getFirestore(app);

  isFirebaseReady = true;

  // Force Firestore network connection
  enableNetwork(db)
    .then(() => {
      console.log("Firestore network enabled successfully");
    })
    .catch((error) => {
      console.error("Firestore network enable failed:", error);
    });

  console.log(
    "Firebase initialized successfully:",
    firebaseConfig.projectId
  );

} catch (error) {
  firebaseConfigError =
    error instanceof Error ? error.message : String(error);

  console.error(
    "Firebase initialization failed:",
    firebaseConfigError
  );
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
};

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
    error: error instanceof Error ? error.message : String(error),

    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,

      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },

    operationType,
    path,
  };

  console.error(
    "Firestore Error Occurred:",
    JSON.stringify(errInfo)
  );

  throw new Error(JSON.stringify(errInfo));
}

export async function logInWithGoogle() {
  if (!isFirebaseReady || !auth) {
    throw new Error(
      firebaseConfigError ||
      "Firebase is not initialized."
    );
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
  if (!auth) return;

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
