// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAeIGf2jXbwwrUA8NvU_CjHqk3mK4-XL2Y",
  authDomain: "mojiflix-e3f49.firebaseapp.com",
  projectId: "mojiflix-e3f49",
  storageBucket: "mojiflix-e3f49.firebasestorage.app",
  messagingSenderId: "336781949592",
  appId: "1:336781949592:web:4fae8406ed0f131a3c2eed",
  measurementId: "G-G0N2RQKZ62",
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
