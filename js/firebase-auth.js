// Firebase Authentication Module

import { auth, db, googleProvider, signInWithPopup, doc, setDoc, getDoc, serverTimestamp } from './firebase-config.js';

// Google Sign-In
export async function signInWithGoogle() {
    try {
        console.log('Initiating Google Sign-In...');
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        console.log('Google Sign-In successful. User ID:', user.uid);
        console.log('Email:', user.email);
        
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
            console.log('New user - no Firestore document found');
            // New user - return user data for additional info collection
            return {
                isNewUser: true,
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                picture: user.photoURL
            };
        } else {
            // Existing user
            const userData = userDoc.data();
            console.log('Existing user found in Firestore. Role:', userData.role);
            return {
                isNewUser: false,
                ...userData,
                uid: user.uid
            };
        }
    } catch (error) {
        console.error('Error signing in with Google:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        throw error;
    }
}

// Create new user in Firestore
export async function createUser(uid, userData) {
    try {
        await setDoc(doc(db, 'users', uid), {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// Get current user data
export async function getCurrentUserData() {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            return { uid: user.uid, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

// Sign out
export function signOut() {
    return auth.signOut();
}

// Listen to auth state changes
export function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}

// Demo login (for testing)
export async function demoLogin(role = 'student') {
    try {
        // Create demo user data
        const demoUser = {
            email: role === 'admin' ? 'admin@demo.com' : 'student@demo.com',
            name: role === 'admin' ? 'Demo Admin' : 'Demo Student',
            role: role,
            department: role === 'admin' ? 'Administration' : 'Computer Science',
            whatsapp: role === 'admin' ? '+1234567890' : '+9876543210',
            isDemo: true
        };
        
        // Store in session
        sessionStorage.setItem('demoUser', JSON.stringify(demoUser));
        return demoUser;
    } catch (error) {
        console.error('Error with demo login:', error);
        throw error;
    }
}

// Check if user is demo
export function isDemoUser() {
    return sessionStorage.getItem('demoUser') !== null;
}

// Get demo user
export function getDemoUser() {
    const demoUserJson = sessionStorage.getItem('demoUser');
    return demoUserJson ? JSON.parse(demoUserJson) : null;
}
