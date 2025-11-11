import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    "projectId": "studio-9222549075-738e2",
    "appId": "1:740752463489:web:58f0db1d6c515425f05f80",
    "apiKey": "AIzaSyATnXw0KQc2iJsr1-1lfDmEa3UJ8k0Ryig",
    "authDomain": "studio-9222549075-738e2.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "740752463489"
};
  

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
