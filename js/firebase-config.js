// Firebase Configuration and Initialization

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDv_XYCIJe5VSTPflAJ6CPv_wEJLuhVz_w",
    authDomain: "python-test-platform.firebaseapp.com",
    projectId: "python-test-platform",
    storageBucket: "python-test-platform.firebasestorage.app",
    messagingSenderId: "387522755630",
    appId: "1:387522755630:web:3e1c585091d658d6e4f3bf",
    measurementId: "G-XCP5F4SX01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Export for use in other files
export { app, analytics, auth, db, googleProvider, signInWithPopup, collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, addDoc, serverTimestamp };
