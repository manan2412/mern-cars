// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-cars.firebaseapp.com",
  projectId: "mern-cars",
  storageBucket: "mern-cars.firebasestorage.app",
  messagingSenderId: "513564733640",
  appId: "1:513564733640:web:154d20714c0e9c5cdc35fd",
  measurementId: "G-RGQD3LB0MF"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);