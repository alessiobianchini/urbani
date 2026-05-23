import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "urbani-d5b54.firebaseapp.com",
  projectId: "urbani-d5b54",
  storageBucket: "urbani-d5b54.firebasestorage.app",
  messagingSenderId: "179120761540",
  appId: "1:179120761540:web:5098333a6ddf1146d0f791",
  measurementId: "G-YG848D6NT6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
