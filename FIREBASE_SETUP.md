# Firebase Setup and Integration Guide

## 🔥 Firebase Configuration Complete!

Your Python Test Platform now uses Firebase for:
- **Authentication** (Google Sign-In)
- **Cloud Firestore** (Database)
- **Real-time data sync**
- **Secure data storage**

---

## 📋 Firebase Security Rules

Copy and paste these rules into your Firebase Console:

### **Go to:** Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
                       request.auth.uid == userId &&
                       request.resource.data.email == request.auth.token.email;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Tests collection
    match /tests/{testId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
    
    // Test Attempts collection
    match /testAttempts/{attemptId} {
      allow read: if isAuthenticated() && 
                     (request.auth.token.email == resource.data.userEmail || isAdmin());
      allow create: if isAuthenticated() && 
                       request.auth.token.email == request.resource.data.userEmail;
      allow update: if isAuthenticated() && 
                       (request.auth.token.email == resource.data.userEmail || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Violations collection
    match /violations/{violationId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
  }
}
```

---

## 🚀 Quick Setup Steps

### Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **python-test-platform**
3. Click **Firestore Database** in the left sidebar
4. Click **Create database**
5. Choose:
   - **Start in production mode** (we'll add rules next)
   - Select location closest to your users
6. Click **Enable**

### Step 2: Apply Security Rules

1. In Firestore Database, click the **Rules** tab
2. Delete existing rules
3. Copy the rules from above (or from `FIREBASE_RULES.txt`)
4. Paste into the rules editor
5. Click **Publish**

### Step 3: Enable Google Authentication

1. Go to **Authentication** in Firebase Console
2. Click **Get started** (if first time)
3. Click **Sign-in method** tab
4. Click on **Google**
5. Toggle **Enable**
6. Set project public-facing name: **Python Test Platform**
7. Choose project support email
8. Click **Save**

### Step 4: Set up Authorized Domains

1. Still in **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Add your domains:
   - `localhost` (already there)
   - Add your production domain if deploying

---

## 📦 Database Structure

Your Firestore will have these collections:

### **users**
```javascript
{
  uid: "firebase-auth-uid",
  email: "student@example.com",
  name: "John Doe",
  role: "student" | "admin",
  department: "Computer Science",
  whatsapp: "+1234567890",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **tests**
```javascript
{
  id: "auto-generated-id",
  title: "Python Basics Test",
  description: "Test description",
  duration: 60,
  startDate: "2026-01-01",
  endDate: "2026-12-31",
  questions: [...],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **testAttempts**
```javascript
{
  id: "auto-generated-id",
  testId: "test-id",
  testTitle: "Python Basics Test",
  userEmail: "student@example.com",
  userName: "John Doe",
  department: "Computer Science",
  whatsapp: "+1234567890",
  startTime: timestamp,
  submitTime: timestamp,
  duration: 60,
  elapsedMinutes: 45,
  autoSubmitted: false,
  totalScore: 75,
  maxScore: 100,
  percentage: 75,
  questionScores: [...],
  answers: {...},
  createdAt: timestamp
}
```

### **violations**
```javascript
{
  id: "auto-generated-id",
  attemptId: "attempt-id",
  userEmail: "student@example.com",
  type: "tab_switch" | "copy_attempt" | "paste_attempt",
  timestamp: timestamp
}
```

---

## 🧪 Testing the Setup

### 1. Test Authentication

```javascript
// Open browser console on login page
// Try signing in with Google
// Check Console for any errors
```

### 2. Test Database Write

After signing in as a student, check Firestore Console:
- Should see a new document in `users` collection
- User data should match your Google account

### 3. Test Firestore Rules

In Firebase Console → Firestore → Rules Playground:

**Test 1: Student can read tests**
```javascript
// Operation: get
// Path: /tests/test1
// Auth: Authenticated as student
// Should: ✅ Allow
```

**Test 2: Student cannot delete tests**
```javascript
// Operation: delete
// Path: /tests/test1
// Auth: Authenticated as student
// Should: ❌ Deny
```

**Test 3: Student can create own attempt**
```javascript
// Operation: create
// Path: /testAttempts/attempt1
// Auth: Authenticated as student
// Data: { userEmail: "student@example.com" }
// Should: ✅ Allow
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep Firebase config public (it's safe in client-side code)
- Use Firestore security rules for access control
- Validate data on client and server side
- Monitor usage in Firebase Console
- Set up billing alerts

### ❌ DON'T:
- Store Firebase service account keys in client code
- Expose admin SDKs in client code
- Skip Firestore security rules
- Allow anonymous writes
- Store sensitive data without encryption

---

## 📊 Monitoring and Analytics

### View Usage
1. Go to Firebase Console
2. Click **Usage and billing**
3. Monitor:
   - Firestore reads/writes
   - Authentication sign-ins
   - Storage usage

### View Database
1. Go to **Firestore Database**
2. Click **Data** tab
3. Browse collections and documents
4. Edit data directly (for testing)

### View Users
1. Go to **Authentication**
2. Click **Users** tab
3. See all registered users
4. Manage user accounts

---

## 🐛 Troubleshooting

### Issue: "Missing or insufficient permissions"

**Solution:**
1. Check Firestore rules are published
2. Verify user is authenticated
3. Check user has correct role for operation

### Issue: "Firebase not initialized"

**Solution:**
1. Check browser console for errors
2. Verify Firebase config is correct
3. Ensure you're using a web server (not file://)

### Issue: Google Sign-In not working

**Solution:**
1. Check Authentication is enabled
2. Verify domain is in authorized domains
3. Check browser allows pop-ups
4. Try demo login instead

### Issue: Data not appearing

**Solution:**
1. Check Firestore rules allow read access
2. Open browser console for errors
3. Verify internet connection
4. Check Firebase Console for data

---

## 📱 Demo Mode vs Firebase Mode

The platform supports both:

### **Demo Mode** (No Firebase needed)
- Click "Student Demo" or "Admin Demo"
- Data stored in sessionStorage
- No persistence across sessions
- Perfect for testing UI

### **Firebase Mode** (Full features)
- Click "Sign in with Google"
- Data stored in Firestore
- Persists across sessions
- Multi-device access
- Admin can view all data

---

## 💰 Firebase Pricing

### Free Tier (Spark Plan) Includes:
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 20,000 deletes/day
- ✅ 1 GB storage
- ✅ 10 GB/month transfer
- ✅ Google Authentication (unlimited)

**Enough for:**
- ~100-200 test attempts per day
- Small to medium classes
- Development and testing

### Upgrading
If you exceed free tier:
1. Go to Firebase Console → Usage and billing
2. Upgrade to Blaze (pay-as-you-go)
3. Set budget alerts
4. First $25/month typically free

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Firestore rules published
- [ ] Google Authentication enabled
- [ ] Authorized domains configured
- [ ] Default admin account created
- [ ] Sample test created
- [ ] Tested on multiple browsers
- [ ] Set up billing alerts
- [ ] Backup strategy in place
- [ ] Privacy policy updated
- [ ] Terms of service ready

---

## 📞 Support

### Firebase Issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

### Platform Issues:
- Check browser console
- Review FIREBASE_RULES.txt
- Test with demo login first

---

## 🎉 You're All Set!

Your Python Test Platform is now powered by Firebase with:
- ✅ Secure authentication
- ✅ Real-time database
- ✅ Scalable infrastructure
- ✅ No server maintenance

**Next steps:**
1. Apply the Firestore rules above
2. Enable Google Authentication
3. Test with demo login
4. Sign in with Google
5. Start creating tests!

---

**Last updated:** January 1, 2026
