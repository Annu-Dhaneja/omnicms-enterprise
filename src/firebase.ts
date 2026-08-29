import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { getFirestore, enableNetwork } from "firebase/firestore";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: ReturnType<typeof initializeApp>;
let db: ReturnType<typeof getFirestore> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;

let isFirebaseReady = false;
let firebaseConfigError: string | null = null;

try {
  const requiredConfig = {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId,
  };

  const missing = Object.entries(requiredConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Firebase configuration missing: ${missing.join(", ")}`
    );
  }

  app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

  auth = getAuth(app);
  db = getFirestore(app);

  isFirebaseReady = true;

  console.log(
    "✅ Firebase initialized:",
    firebaseConfig.projectId
  );
} catch (error) {
  firebaseConfigError =
    error instanceof Error
      ? error.message
      : String(error);

  console.error(
    "❌ Firebase initialization failed:",
    firebaseConfigError
  );
}

export {
  app,
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
): never {
  const currentUser = auth?.currentUser as User | null;

  const message =
    error instanceof Error
      ? error.message
      : String(error);

  const errInfo: FirestoreErrorInfo = {
    error: message,

    operationType,
    path,

    authInfo: {
      userId: currentUser?.uid ?? null,
      email: currentUser?.email ?? null,
      emailVerified: currentUser?.emailVerified ?? null,
      isAnonymous: currentUser?.isAnonymous ?? null,
      tenantId: currentUser?.tenantId ?? null,

      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) ?? [],
    },
  };

  console.error(
    "🔥 Firestore Error:",
    errInfo
  );

  throw new Error(
    JSON.stringify(errInfo)
  );
}

export async function logInWithGoogle() {
  if (!isFirebaseReady || !auth) {
    throw new Error(
      firebaseConfigError ||
      "Firebase is not initialized."
    );
  }

  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
  });

  try {
    const result = await signInWithPopup(
      auth,
      provider
    );

    return result.user;
  } catch (error) {
    console.error(
      "❌ Google login failed:",
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
      "❌ Signout failed:",
      error
    );

    throw error;
  }
}
