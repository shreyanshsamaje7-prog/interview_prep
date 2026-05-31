// Import the functions you need from the SDKs you need
import { initializeApp,getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR3KQ1WjNW0GEzqW5Z6QpfAEnjMThSciI",
  authDomain: "prepwise-481d1.firebaseapp.com",
  projectId: "prepwise-481d1",
  storageBucket: "prepwise-481d1.firebasestorage.app",
  messagingSenderId: "807308678470",
  appId: "1:807308678470:web:2899d315bc4e13d64a8147",
  measurementId: "G-4QV06WKESE"
};

// Initialize Firebase
const app =!getApps().length ?initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app)
export const db = getFirestore(app)