import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKKPvfsG9hb7QF6XaVZ12efU6rPX6xzdY",
  authDomain: "ofitsiant-f0a27.firebaseapp.com",
  projectId: "ofitsiant-f0a27",
  storageBucket: "ofitsiant-f0a27.firebasestorage.app",
  messagingSenderId: "355685238924",
  appId: "1:355685238924:web:5b398a3a9f6a879ed193a9"
};

const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
