import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyANvqaROfrnlJenjydejL8xT0Qn9JQwkWs",
  authDomain: "puredrop-69f7a.firebaseapp.com",
  databaseURL: "https://puredrop-69f7a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "puredrop-69f7a",
  storageBucket: "puredrop-69f7a.firebasestorage.app",
  messagingSenderId: "708032538971",
  appId: "1:708032538971:web:b62592dbb2a277de13127e",
  measurementId: "G-4KJEVNC8E3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
