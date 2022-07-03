import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYKeYgm5g-ZO3Wx96WGUwOIyva4YsaG38",
  authDomain: "settle-eu.firebaseapp.com",
  projectId: "settle-eu",
  storageBucket: "settle-eu.appspot.com",
  messagingSenderId: "219079344399",
  appId: "1:219079344399:web:9ec708fcab451eca2cbe7a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
