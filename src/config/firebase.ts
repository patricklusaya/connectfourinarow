import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyClzHDQQsY3zb8XnaLNyw05aruVTqLY23A",
  authDomain: "football-connect-4.firebaseapp.com",
  projectId: "football-connect-4",
  storageBucket: "football-connect-4.appspot.com",
  messagingSenderId: "834076095082",
  appId: "1:834076095082:web:f7b1236cb71b688af8d013",
  measurementId: "G-CTE70R0PP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

