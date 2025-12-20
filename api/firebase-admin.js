import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    ),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
