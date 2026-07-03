import { getApps, initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const isFirestoreConfigured = Boolean(projectId && ((clientEmail && privateKey) || process.env.GOOGLE_APPLICATION_CREDENTIALS));

let firestore: Firestore | null = null;

export function getServerFirestore() {
  if (!isFirestoreConfigured) {
    throw new Error("Firestore env is not configured.");
  }

  if (!getApps().length) {
    initializeApp({
      credential: clientEmail && privateKey && projectId
        ? cert({ projectId, clientEmail, privateKey })
        : applicationDefault(),
      projectId
    });
  }

  if (!firestore) {
    firestore = getFirestore();
  }

  return firestore;
}
