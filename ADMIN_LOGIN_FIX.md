# Admin Login Fix & Troubleshooting Guide

## ✅ Issue Fixed!

The admin login redirect issue has been resolved. Here's what was changed:

### Changes Made:

1. **Enhanced role checking** in login.html
2. **Better redirect logic** after Google Sign-In
3. **Added console logging** for debugging
4. **Created setup-admin.html** for easy admin account creation
5. **Improved dashboard access control**

---

## 🔧 Setting Up Your First Admin Account

### Method 1: Using Setup Page (Recommended)

1. **Open `setup-admin.html` in your browser**
   ```
   http://localhost:8000/setup-admin.html
   ```

2. **Click "Sign in with Google & Create Admin Account"**

3. **Sign in with your Google account**

4. **Done!** Your admin account is created

5. **Delete `setup-admin.html`** file for security

### Method 2: Manual Setup in Firebase Console

1. Go to Firebase Console → Firestore Database
2. Click "Start collection"
3. Collection ID: `users`
4. Document ID: Use your Firebase Auth UID (found in Authentication tab)
5. Add fields:
   ```
   email: "your-email@gmail.com"
   name: "Your Name"
   role: "admin"
   department: "Administration"
   whatsapp: "+1234567890"
   createdAt: (current timestamp)
   ```
6. Click "Save"

---

## 🚀 How to Login as Admin

### Step 1: Go to Homepage
```
http://localhost:8000
```

### Step 2: Click "Admin Login"
This adds `?admin=true` to the URL

### Step 3: Click "Sign in with Google"
Sign in with the Google account you set up as admin

### Step 4: Check Console
Open browser DevTools (F12) and check Console for:
```
Login result: {isNewUser: false, role: "admin", ...}
User role: admin Admin login? true
Redirecting to admin dashboard
```

---

## 🐛 Troubleshooting

### Issue: Still redirecting to student dashboard

**Check these:**

1. **Verify admin account in Firestore:**
   - Open Firebase Console → Firestore
   - Check `users` collection
   - Find your user document
   - Verify `role: "admin"` field exists

2. **Check browser console:**
   - Press F12 to open DevTools
   - Go to Console tab
   - Look for errors or logs
   - Should see: "User role: admin"

3. **Clear browser cache and session:**
   ```javascript
   // Open Console (F12) and run:
   sessionStorage.clear();
   localStorage.clear();
   location.reload();
   ```

4. **Verify URL has admin parameter:**
   - Should see: `login.html?admin=true`
   - If not, click "Admin Login" from homepage, not "Get Started"

### Issue: "Access denied. Admin credentials required."

**Cause:** Your Google account is registered as a student

**Solutions:**
- Use a different Google account for admin
- Or manually update your role in Firestore:
  1. Go to Firestore Console
  2. Find your user document
  3. Edit `role` field from "student" to "admin"
  4. Save changes

### Issue: "Admin account not found"

**Cause:** Trying to create new admin via normal login flow

**Solution:**
- Use `setup-admin.html` page instead
- Or manually create admin in Firestore (see Method 2 above)

### Issue: Login works but immediately logs out

**Check:**
1. **Firestore Rules:** Make sure you've published the rules
2. **Authentication:** Verify Google Sign-In is enabled
3. **Console Errors:** Check for permission errors

---

## 🔍 Debug Checklist

Run through this checklist if admin login isn't working:

- [ ] Firebase Authentication is enabled
- [ ] Google Sign-In provider is enabled
- [ ] Firestore rules are published
- [ ] Admin account exists in Firestore with `role: "admin"`
- [ ] Logging in from `login.html?admin=true` URL
- [ ] Browser console shows no errors
- [ ] Using the correct Google account
- [ ] Session storage is not blocking (not in incognito mode)

---

## 📝 Testing Steps

### Test 1: Student Login
1. Go to homepage
2. Click "Get Started"
3. Sign in with Google (non-admin account)
4. Should redirect to **student-dashboard.html** ✅

### Test 2: Admin Login
1. Go to homepage
2. Click "Admin Login"
3. Sign in with Google (admin account)
4. Should redirect to **admin-dashboard.html** ✅

### Test 3: Wrong Login Type
1. Go to "Get Started"
2. Sign in with admin account
3. Should show error: "This is an administrator account..." ✅

### Test 4: Demo Login
1. Click "Student Demo" → Student dashboard ✅
2. Click "Admin Demo" → Admin dashboard ✅

---

## 🔐 Admin Account Structure

Your admin account in Firestore should look like:

```javascript
// Collection: users
// Document ID: {firebase-auth-uid}
{
  email: "admin@example.com",
  name: "Admin Name",
  role: "admin",              // ← This is critical!
  department: "Administration",
  whatsapp: "+1234567890",
  picture: "https://...",     // From Google
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Key field:** `role: "admin"` must be exactly "admin" (lowercase)

---

## 💡 Quick Fixes

### Quick Fix 1: Force Admin Role Update

If you have an existing account and want to make it admin:

1. **Open Browser Console (F12)**
2. **Run this after logging in:**
   ```javascript
   // Get your user data
   const user = JSON.parse(sessionStorage.getItem('currentUser'));
   user.role = 'admin';
   sessionStorage.setItem('currentUser', JSON.stringify(user));
   
   // Then update in Firestore manually via Console
   ```

3. **Update in Firestore:**
   - Go to Firebase Console
   - Navigate to your user document
   - Change role to "admin"

### Quick Fix 2: Check Current User Role

**In browser console:**
```javascript
const user = JSON.parse(sessionStorage.getItem('currentUser'));
console.log('Current role:', user?.role);
```

Should show: `Current role: admin`

### Quick Fix 3: Reset Everything

If nothing works:
```javascript
// Clear all data
sessionStorage.clear();
localStorage.clear();

// Reload page
location.reload();

// Then login fresh
```

---

## 📞 Still Having Issues?

### Check These Files:

1. **login.html** - Should have `?admin=true` check
2. **firebase-auth.js** - Should return user role
3. **Firestore** - Should have admin user document

### Console Commands for Debugging:

```javascript
// Check if Firebase is loaded
console.log('Auth:', typeof auth !== 'undefined');

// Check current URL
console.log('URL:', window.location.href);

// Check session
console.log('Session:', sessionStorage.getItem('currentUser'));

// Check if admin login
const urlParams = new URLSearchParams(window.location.search);
console.log('Is admin login?', urlParams.get('admin') === 'true');
```

---

## ✅ Success Indicators

When admin login works correctly, you should see:

1. **URL:** `http://localhost:8000/login.html?admin=true`
2. **Console logs:**
   ```
   Initiating Google Sign-In...
   Google Sign-In successful. User ID: xxxxx
   Existing user found in Firestore. Role: admin
   Login result: {isNewUser: false, role: "admin", ...}
   User role: admin Admin login? true
   Redirecting to admin dashboard
   ```
3. **Result:** admin-dashboard.html loads
4. **Dashboard shows:** Admin name and tabs (Students, Test Attempts, Manage Tests)

---

## 🎯 Summary

**The fix ensures:**
- ✅ Admin login URL parameter is checked correctly
- ✅ User role is validated after Google Sign-In
- ✅ Proper redirects based on role
- ✅ Clear error messages for wrong login type
- ✅ Console logging for debugging
- ✅ Protection against accessing wrong dashboard

**To use admin login:**
1. Create admin account using `setup-admin.html`
2. Use "Admin Login" button from homepage
3. Sign in with admin Google account
4. Get redirected to admin dashboard

**Done! 🎉**
