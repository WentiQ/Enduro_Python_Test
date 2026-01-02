// Firebase Database Operations

import { db, collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, addDoc, serverTimestamp } from './firebase-config.js';

// ============== USERS ==============

export async function getAllUsers() {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        return usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

export async function getUsersByRole(role) {
    try {
        const q = query(collection(db, 'users'), where('role', '==', role));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting users by role:', error);
        return [];
    }
}

export async function updateUser(uid, data) {
    try {
        await updateDoc(doc(db, 'users', uid), {
            ...data,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error updating user:', error);
        return false;
    }
}

// ============== TESTS ==============

export async function createTest(testData) {
    try {
        const docRef = await addDoc(collection(db, 'tests'), {
            ...testData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating test:', error);
        throw error;
    }
}

export async function getTest(testId) {
    try {
        const testDoc = await getDoc(doc(db, 'tests', testId));
        if (testDoc.exists()) {
            return { id: testDoc.id, ...testDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting test:', error);
        return null;
    }
}

export async function getAllTests() {
    try {
        const testsSnapshot = await getDocs(collection(db, 'tests'));
        const firebaseTests = testsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // If no tests in Firebase, fall back to localStorage
        if (firebaseTests.length === 0) {
            console.log('No tests in Firebase, checking localStorage...');
            const localTests = JSON.parse(localStorage.getItem('tests') || '[]');
            return localTests;
        }
        
        return firebaseTests;
    } catch (error) {
        console.error('Error getting tests from Firebase, falling back to localStorage:', error);
        // Fallback to localStorage
        const localTests = JSON.parse(localStorage.getItem('tests') || '[]');
        return localTests;
    }
}

export async function updateTest(testId, data) {
    try {
        await updateDoc(doc(db, 'tests', testId), {
            ...data,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error updating test:', error);
        return false;
    }
}

export async function deleteTest(testId) {
    try {
        await deleteDoc(doc(db, 'tests', testId));
        return true;
    } catch (error) {
        console.error('Error deleting test:', error);
        return false;
    }
}

// ============== TEST ATTEMPTS ==============

export async function createTestAttempt(attemptData) {
    try {
        const docRef = await addDoc(collection(db, 'testAttempts'), {
            ...attemptData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating test attempt:', error);
        throw error;
    }
}

export async function getTestAttempt(attemptId) {
    try {
        const attemptDoc = await getDoc(doc(db, 'testAttempts', attemptId));
        if (attemptDoc.exists()) {
            return { id: attemptDoc.id, ...attemptDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting test attempt:', error);
        return null;
    }
}

export async function getTestAttemptsByUser(userEmail) {
    try {
        const q = query(collection(db, 'testAttempts'), where('userEmail', '==', userEmail));
        const snapshot = await getDocs(q);
        const firebaseAttempts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // If no attempts in Firebase, fall back to localStorage
        if (firebaseAttempts.length === 0) {
            console.log('No attempts in Firebase, checking localStorage...');
            const localAttempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
            return localAttempts.filter(a => a.userEmail === userEmail);
        }
        
        return firebaseAttempts;
    } catch (error) {
        console.error('Error getting test attempts from Firebase, falling back to localStorage:', error);
        // Fallback to localStorage
        const localAttempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
        return localAttempts.filter(a => a.userEmail === userEmail);
    }
}

export async function getTestAttemptsByTest(testId) {
    try {
        const q = query(collection(db, 'testAttempts'), where('testId', '==', testId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting test attempts by test:', error);
        return [];
    }
}

export async function getAllTestAttempts() {
    try {
        const attemptsSnapshot = await getDocs(collection(db, 'testAttempts'));
        const firebaseAttempts = attemptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // If no attempts in Firebase, fall back to localStorage
        if (firebaseAttempts.length === 0) {
            console.log('No attempts in Firebase, checking localStorage...');
            const localAttempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
            return localAttempts;
        }
        
        return firebaseAttempts;
    } catch (error) {
        console.error('Error getting all test attempts from Firebase, falling back to localStorage:', error);
        // Fallback to localStorage
        const localAttempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
        return localAttempts;
    }
}

export async function updateTestAttempt(attemptId, data) {
    try {
        await updateDoc(doc(db, 'testAttempts', attemptId), {
            ...data,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error updating test attempt:', error);
        return false;
    }
}

// ============== VIOLATIONS ==============

export async function logViolation(violationData) {
    try {
        await addDoc(collection(db, 'violations'), {
            ...violationData,
            timestamp: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error logging violation:', error);
        return false;
    }
}

export async function getViolationsByAttempt(attemptId) {
    try {
        const q = query(collection(db, 'violations'), where('attemptId', '==', attemptId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting violations:', error);
        return [];
    }
}

// ============== HELPER FUNCTIONS ==============

export async function checkUserHasAttemptedTest(userEmail, testId) {
    try {
        const q = query(
            collection(db, 'testAttempts'),
            where('userEmail', '==', userEmail),
            where('testId', '==', testId)
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            // Check localStorage as fallback
            const localAttempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
            return localAttempts.some(a => a.userEmail === userEmail && a.testId === testId);
        }
        
        return !snapshot.empty;
    } catch (error) {
        console.error('Error checking test attempt in Firebase, checking localStorage:', error);
        // Fallback to localStorage
        const localAttempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
        return localAttempts.some(a => a.userEmail === userEmail && a.testId === testId);
    }
}

// Initialize default data if needed
export async function initializeDefaultData() {
    try {
        // Check if default admin exists
        const users = await getAllUsers();
        const adminExists = users.some(u => u.role === 'admin');
        
        if (!adminExists) {
            // Create default admin
            await setDoc(doc(db, 'users', 'default-admin'), {
                email: 'admin@test.com',
                name: 'Admin',
                role: 'admin',
                department: 'Administration',
                whatsapp: '+1234567890',
                createdAt: serverTimestamp()
            });
        }
        
        // Check if default test exists
        const tests = await getAllTests();
        if (tests.length === 0) {
            // Import questions
            const defaultQuestions = window.defaultQuestions || [];
            
            await addDoc(collection(db, 'tests'), {
                title: 'Python Basics Test',
                description: 'Test your knowledge of Python fundamentals including variables, loops, functions, and data structures.',
                duration: 60,
                startDate: '2026-01-01',
                endDate: '2026-12-31',
                questions: defaultQuestions.slice(0, 5),
                createdAt: serverTimestamp()
            });
        }
        
        return true;
    } catch (error) {
        console.error('Error initializing default data:', error);
        return false;
    }
}
