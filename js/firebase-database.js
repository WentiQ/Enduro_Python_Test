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

export async function addTestAttemptToUser(userEmail, attemptData) {
    try {
        // First, find the user document by email
        const q = query(collection(db, 'users'), where('email', '==', userEmail));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            console.error('User not found with email:', userEmail);
            return false;
        }
        
        const userDoc = snapshot.docs[0];
        const userId = userDoc.id;
        
        // Get existing attempts or initialize empty array
        const userData = userDoc.data();
        const existingAttempts = userData.testAttempts || [];
        
        // Add new attempt to the array
        existingAttempts.push({
            testId: attemptData.testId,
            testTitle: attemptData.testTitle,
            attemptDate: attemptData.submitTime,
            totalScore: attemptData.totalScore,
            maxScore: attemptData.maxScore,
            percentage: attemptData.percentage,
            questionScores: attemptData.questionScores.map(qs => ({
                questionNumber: qs.questionNumber,
                originalIndex: qs.originalIndex,
                score: qs.score,
                maxScore: qs.maxScore,
                passedTestCases: qs.passedTestCases || 0,
                totalTestCases: qs.totalTestCases || 0
            }))
        });
        
        // Update the user document
        await updateDoc(doc(db, 'users', userId), {
            testAttempts: existingAttempts,
            updatedAt: serverTimestamp()
        });
        
        console.log('Test attempt added to user collection successfully');
        return true;
    } catch (error) {
        console.error('Error adding test attempt to user:', error);
        return false;
    }
}

export async function getUserTestAttempts(userEmail) {
    try {
        const q = query(collection(db, 'users'), where('email', '==', userEmail));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            return [];
        }
        
        const userData = snapshot.docs[0].data();
        return userData.testAttempts || [];
    } catch (error) {
        console.error('Error getting user test attempts:', error);
        return [];
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
        console.log('Loaded tests from Firebase:', firebaseTests.length);
        return firebaseTests;
    } catch (error) {
        console.error('Error getting tests from Firebase:', error);
        return [];
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
        console.log('Loaded user attempts from Firebase:', firebaseAttempts.length);
        return firebaseAttempts;
    } catch (error) {
        console.error('Error getting test attempts from Firebase:', error);
        return [];
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
        console.log('Loaded all test attempts from Firebase:', firebaseAttempts.length);
        return firebaseAttempts;
    } catch (error) {
        console.error('Error getting all test attempts from Firebase:', error);
        return [];
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
        const hasAttempted = !snapshot.empty;
        console.log(`User ${userEmail} has attempted test ${testId}:`, hasAttempted);
        return hasAttempted;
    } catch (error) {
        console.error('Error checking test attempt in Firebase:', error);
        return false;
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
