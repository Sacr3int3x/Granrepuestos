import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    "projectId": "studio-9222549075-738e2",
    "appId": "1:740752463489:web:58f0db1d6c515425f05f80",
    "apiKey": "AIzaSyATnXw0KQc2iJsr1-1lfDmEa3UJ8k0Ryig",
    "authDomain": "studio-9222549075-738e2.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "740752463489"
};

// Singleton pattern to initialize Firebase safely
function getFirebaseApp() {
    if (getApps().length) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

export function getDb() {
    return getFirestore(getFirebaseApp());
}

// For client-side usage where you might still need the db instance directly
export const db = getDb();
