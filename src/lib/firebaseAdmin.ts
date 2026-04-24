import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Only initialize if we have the required environment variables
let app: any;

// Server-side only initialization
if (typeof window === 'undefined') {
  try {
    // @ts-ignore - Ignore TypeScript error for process.env
    const projectId = process.env.FIREBASE_PROJECT_ID;
    // @ts-ignore
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // @ts-ignore
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      const firebaseAdminConfig = {
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
      };

      app = !getApps().length ? initializeApp(firebaseAdminConfig) : getApps()[0];
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null; 