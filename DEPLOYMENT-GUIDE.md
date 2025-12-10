# FIREBASE SETUP - STEP BY STEP GUIDE

## Quick Firebase Setup (10 Minutes)

### Step 1: Create Firebase Account
1. Open: https://console.firebase.google.com
2. Sign in with Google account (create free if you don't have)
3. Click "Add Project" or "Create a Project"

### Step 2: Create Project
1. **Project Name**: Type "LSM-Cricket-Tournament" or any name
2. Click "Continue"
3. **Google Analytics**: Turn OFF (not needed) or leave default
4. Click "Create Project"
5. Wait 30 seconds for project creation
6. Click "Continue"

### Step 3: Setup Realtime Database
1. In left sidebar, find and click "Build" > "Realtime Database"
2. Click "Create Database" button
3. **Database Location**: Choose "United States (us-central1)" or closest to India
4. **Security Rules**: Select "Start in TEST MODE"
   - ⚠️ IMPORTANT: Choose TEST MODE for public access
5. Click "Enable"
6. Your database is ready!

### Step 4: Configure Database Rules (IMPORTANT!)
1. You're now in the Realtime Database view
2. Click on "Rules" tab at the top
3. You'll see default rules - REPLACE them with:

```json
{
  "rules": {
    "teams": {
      ".read": true,
      ".write": true
    }
  }
}
```

4. Click "Publish" button
5. ✅ Rules are now set for public read/write on teams

### Step 5: Get Your Firebase Configuration
1. Click the ⚙️ (Settings/Gear) icon in left sidebar
2. Click "Project Settings"
3. Scroll down to "Your apps" section
4. Click the "</>" (Web) icon
5. **App nickname**: Type "LSM Cricket Web App"
6. ❌ DON'T check "Also set up Firebase Hosting"
7. Click "Register app"

### Step 6: Copy Configuration Code
You'll see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABC123...",
  authDomain: "lsm-cricket-xyz.firebaseapp.com",
  databaseURL: "https://lsm-cricket-xyz-default-rtdb.firebaseio.com",
  projectId: "lsm-cricket-xyz",
  storageBucket: "lsm-cricket-xyz.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**COPY THIS ENTIRE BLOCK!**

### Step 7: Update Your Website Files
1. Open the file: `script.js`
2. Find lines 2-10 (the firebaseConfig section)
3. REPLACE the dummy config with YOUR copied config
4. Save the file

**Before:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDEMOKEY123456789",
    authDomain: "lsm-cricket-tournament.firebaseapp.com",
    // ... dummy data
};
```

**After (with YOUR config):**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyABC123...",  // YOUR actual key
    authDomain: "lsm-cricket-xyz.firebaseapp.com",  // YOUR actual domain
    // ... YOUR actual config
};
```

### Step 8: Test Locally
1. Open `index.html` in web browser
2. Click Login (no credentials)
3. Click "Add New Team"
4. Register a test team
5. Go to Firebase Console > Realtime Database
6. You should see "teams" node with your data!

✅ Firebase is now working!

---

## Deployment Options

### OPTION A: Netlify (Easiest - Recommended)

#### Method 1: Drag & Drop (Simplest!)
1. Go to: https://app.netlify.com
2. Sign up with email or GitHub (FREE)
3. After login, you'll see "Want to deploy a new site?"
4. **Drag the entire LSM-Cricket-Tournament folder** to the drag area
5. Wait 30 seconds
6. ✅ Done! You'll get URL like: https://random-name-123.netlify.app

#### Method 2: From Folder
1. Login to Netlify
2. Click "Add new site" > "Deploy manually"
3. Drag your project folder
4. Get instant URL

**Change Site Name (Optional):**
1. In Netlify dashboard, click your site
2. Click "Site settings"
3. Click "Change site name"
4. Type: "lsm-cricket-2026" (or any available name)
5. Your URL becomes: https://lsm-cricket-2026.netlify.app

---

### OPTION B: Vercel

1. Go to: https://vercel.com
2. Click "Sign Up" (use GitHub, GitLab, or Email)
3. After login, click "Add New..." > "Project"
4. Click "Browse" or drag your folder
5. Click "Deploy"
6. ✅ Live at: https://your-project.vercel.app

**Custom URL:**
1. Click project > Settings
2. Click "Domains"
3. Add custom name

---

### OPTION C: GitHub Pages (Free Domain)

1. Create GitHub account: https://github.com/signup
2. Click "+" icon (top right) > "New repository"
3. **Repository name**: lsm-cricket-tournament
4. Select "Public"
5. Click "Create repository"
6. Upload all your files:
   - Click "uploading an existing file"
   - Drag all files (index.html, styles.css, script.js)
   - Click "Commit changes"
7. Go to repository Settings > Pages
8. Under "Source", select "main" branch
9. Click "Save"
10. ✅ Live at: https://yourusername.github.io/lsm-cricket-tournament

---

## FREE Domain Options

### Option 1: Use Hosting Subdomain (Easiest)
- Netlify: https://lsm-cricket-2026.netlify.app
- Vercel: https://lsm-cricket-2026.vercel.app
- GitHub: https://yourusername.github.io/lsm-cricket-2026

### Option 2: Freenom (Free Domain for 1 Year)
1. Go to: https://www.freenom.com
2. Search for domain: "lsmcricket"
3. Select free extension (.tk, .ml, .ga, .cf, .gq)
4. Click "Get it now"
5. Sign up and complete registration
6. In Netlify/Vercel settings, add custom domain
7. Follow DNS configuration steps

### Option 3: InfinityFree (Free Subdomain)
1. Go to: https://infinityfree.net
2. Sign up for free hosting
3. Get subdomain: lsmcricket.epizy.com
4. Upload files via File Manager

---

## 📊 Accessing Your Data

### View in Firebase Console:
1. Go to Firebase Console
2. Click "Realtime Database"
3. See all registered teams in real-time

### View in Website (Admin):
1. Open your website
2. Login with:
   - Username: AdminLsm
   - Password: AdminLSM
3. Click "Admin Panel"
4. See all registrations

### Export Data:
1. Firebase Console > Realtime Database
2. Click on "teams" node
3. Click three dots ⋮ > "Export JSON"
4. Save backup file

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Realtime Database enabled with test mode rules
- [ ] Firebase config copied to script.js
- [ ] Tested locally in browser
- [ ] Website deployed to Netlify/Vercel/GitHub Pages
- [ ] Can access website from any device
- [ ] Team registration works
- [ ] Data appears in Firebase Console
- [ ] Admin login works
- [ ] Squad view shows teams

---

## 🎉 Final URLs You'll Have:

1. **Website URL**: https://your-site-name.netlify.app
2. **Firebase Console**: https://console.firebase.google.com
3. **Admin Access**: Same website URL with admin login

**Share the website URL with everyone to register teams!**

---

## 💡 Important Notes:

1. **Firebase is FREE forever** for your usage level
2. **Hosting is FREE forever** on Netlify/Vercel/GitHub
3. **No credit card required** for any service
4. **Data is stored in cloud** - accessible from anywhere
5. **Website works on mobile** - fully responsive
6. **HTTPS enabled** - secure by default

---

## 🆘 Troubleshooting:

**Problem**: Data not saving
- **Solution**: Check Firebase config in script.js
- Verify database rules are in test mode

**Problem**: Website not loading
- **Solution**: Clear browser cache or try incognito mode

**Problem**: Can't access admin panel
- **Solution**: Username: AdminLsm (capital L), Password: AdminLSM (all capitals LSM)

---

Need help? Check Firebase Console for any errors in the Realtime Database rules or data structure.
