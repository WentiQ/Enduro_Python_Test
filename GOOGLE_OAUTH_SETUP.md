# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Python Test Platform.

## Why Google OAuth?

- Secure authentication without managing passwords
- Automatic user profile information (name, email, photo)
- Professional and trusted login method
- Better user experience

## Setup Steps

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Enter project name (e.g., "Python Test Platform")
5. Click "Create"

### Step 2: Enable Google+ API

1. In the Google Cloud Console, open your project
2. Click on the menu (☰) → "APIs & Services" → "Library"
3. Search for "Google+ API"
4. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Click "Configure Consent Screen"
   - Select "External" (for testing) or "Internal" (for organization)
   - Fill in required fields:
     - App name: "Python Test Platform"
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - Skip scopes (click "Save and Continue")
   - Add test users if needed (for External)
   - Click "Save and Continue"

4. Return to "Credentials" and create OAuth client ID:
   - Application type: "Web application"
   - Name: "Python Test Platform Web Client"
   - Authorized JavaScript origins:
     - For local testing: `http://localhost:8000`
     - For local testing (alt port): `http://localhost:5500`
     - For production: `https://yourdomain.com`
   - Authorized redirect URIs: (Usually not needed for client-side)
     - `http://localhost:8000`
   - Click "Create"

5. Copy the **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)

### Step 4: Update Your Application

1. Open `login.html` in a text editor
2. Find this line:
   ```html
   data-client_id="YOUR_GOOGLE_CLIENT_ID"
   ```
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:
   ```html
   data-client_id="123456789-abcdefg.apps.googleusercontent.com"
   ```
4. Save the file

### Step 5: Test the Setup

1. Start your local web server:
   ```bash
   python -m http.server 8000
   ```

2. Open in browser: `http://localhost:8000`

3. Click "Get Started"

4. You should see the Google Sign-In button

5. Click it and sign in with your Google account

6. If prompted, authorize the app

7. You should be redirected to the student dashboard

## Troubleshooting

### Issue: "This app isn't verified"

**Cause**: Your app is in testing mode

**Solution**: 
- Click "Advanced" → "Go to [App Name] (unsafe)"
- For production, submit your app for verification

### Issue: "redirect_uri_mismatch"

**Cause**: Your current URL doesn't match authorized origins

**Solution**:
1. Go back to Google Cloud Console
2. Edit your OAuth client ID
3. Add the exact URL you're using to "Authorized JavaScript origins"
4. Wait a few minutes for changes to propagate

### Issue: Button doesn't appear

**Cause**: Script loading error or wrong Client ID

**Solution**:
1. Check browser console (F12) for errors
2. Verify Client ID is correct
3. Ensure you're running on a web server (not file://)
4. Check internet connection

### Issue: "idpiframe_initialization_failed"

**Cause**: Cookies are blocked or browser privacy settings

**Solution**:
- Allow third-party cookies for Google
- Disable tracking protection for your site
- Try in a different browser

## Security Best Practices

### For Development

✅ Use `http://localhost` or `http://127.0.0.1`
✅ Add test users in OAuth consent screen
✅ Keep Client ID in code (it's not secret)

❌ Don't use `file://` protocol
❌ Don't share Client Secret publicly (not used in this app)

### For Production

✅ Use HTTPS (`https://yourdomain.com`)
✅ Publish OAuth consent screen
✅ Submit for verification if public
✅ Add privacy policy and terms of service
✅ Use environment variables for sensitive data
✅ Implement proper backend authentication

❌ Don't use HTTP in production
❌ Don't store sensitive data in LocalStorage
❌ Don't skip security reviews

## Alternative: Demo Login

If you want to test without setting up Google OAuth:

1. No setup required!
2. Just use the "Student Demo" or "Admin Demo" buttons
3. Perfect for development and testing
4. No internet connection needed (except for Pyodide)

## Production Deployment

When deploying to production:

1. **Use HTTPS**: Required by Google OAuth
2. **Update authorized origins**: Add your production domain
3. **Backend integration**: Consider server-side authentication
4. **Database**: Use proper database instead of LocalStorage
5. **Security**: Implement CSRF protection, rate limiting, etc.
6. **Verification**: Submit app for Google verification if public

## Client ID vs Client Secret

### Client ID
- **Public**: Safe to include in HTML/JavaScript
- **Used for**: Identifying your app to Google
- **In this app**: Used in `login.html`

### Client Secret
- **Private**: Never include in client-side code
- **Used for**: Server-to-server authentication
- **In this app**: Not needed (we use implicit flow)

## Testing Different Scenarios

### Test as Multiple Users

1. Use different Google accounts
2. Or use demo login for quick testing
3. Open incognito/private windows for separate sessions

### Test Authentication Flow

1. Login → Success → Dashboard
2. Login → Logout → Login again
3. New user → Additional info form → Dashboard
4. Admin login → Check role verification

## Sample Client IDs Structure

```
Format: [PROJECT_NUMBER]-[RANDOM_STRING].apps.googleusercontent.com

Examples (fake):
123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
987654321098-xyz987wvu654tsr321qpo987nml654kj.apps.googleusercontent.com
```

## Consent Screen Configuration

### Required Information
- App name
- User support email
- Developer email

### Optional but Recommended
- App logo (120x120 px)
- App domain
- Privacy policy URL
- Terms of service URL

### Scopes Needed
- **openid**: Basic authentication
- **profile**: User's name and photo
- **email**: User's email address

These are included by default in Google Sign-In.

## Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `popup_closed_by_user` | User closed login popup | Normal behavior, try again |
| `access_denied` | User denied permission | User must allow access |
| `invalid_client` | Wrong Client ID | Check and update Client ID |
| `unauthorized_client` | Origin not authorized | Add origin to authorized list |

## Resources

- [Google Identity Documentation](https://developers.google.com/identity)
- [OAuth 2.0 Overview](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In JavaScript Client](https://developers.google.com/identity/gsi/web)

## Support

For issues with:
- **Google OAuth**: Check [Google Identity Help](https://developers.google.com/identity/support)
- **This Platform**: Check README.md or browser console errors

---

**Note**: This setup is optional. The platform works perfectly with demo login for testing and development!
