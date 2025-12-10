# Lingasamudram Premier League 2026 - Cricket Tournament Website

## 🏏 Features
- **Public Access**: Anyone can view and register teams without login
- **Admin Access**: Special admin panel with credentials (AdminLsm/AdminLSM)
- **Team Registration**: Register teams with 11-16 players
- **Captain Selection**: Mandatory captain selection with Cricheros mobile number and Aadhar validation
- **Tournament Information**: Entry fee ₹1,500, Winner ₹40,000, Runner-up ₹20,000
- **Tournament Date**: January 10th, 2026
- **HD Background**: Beautiful cricket ground backgrounds
- **Data Storage**: All registrations saved to Firebase (free tier)

## 🚀 FREE Hosting & Deployment Options

### Option 1: Netlify (Recommended - Easiest)
1. Go to [Netlify](https://www.netlify.com) and sign up for free
2. Drag and drop the entire `LSM-Cricket-Tournament` folder to Netlify
3. Your site will be live instantly with a free URL like: `https://your-site-name.netlify.app`
4. **Custom Domain**: You can get a free domain from Freenom.com or use Netlify's subdomain

### Option 2: Vercel
1. Go to [Vercel](https://vercel.com) and sign up for free
2. Import your project or drag and drop files
3. Get instant deployment with URL: `https://your-site-name.vercel.app`

### Option 3: GitHub Pages
1. Create a free GitHub account at [GitHub](https://github.com)
2. Create a new repository named `lsm-cricket-tournament`
3. Upload all files
4. Go to Settings > Pages > Enable GitHub Pages
5. Your site will be available at: `https://yourusername.github.io/lsm-cricket-tournament`

## 🔥 Firebase Setup (FREE Forever - Required for Database)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Name it: "LSM Cricket Tournament"
4. Disable Google Analytics (not needed)
5. Click "Create Project"

### Step 2: Set up Realtime Database
1. In Firebase Console, click "Realtime Database" from left menu
2. Click "Create Database"
3. Choose location: "United States" or nearest
4. **Start in TEST MODE** (important for public access)
5. Click "Enable"

### Step 3: Configure Database Rules
In Realtime Database, go to "Rules" tab and paste:
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
Click "Publish"

### Step 4: Get Firebase Configuration
1. Click the gear icon ⚙️ > Project Settings
2. Scroll down to "Your apps"
3. Click the Web icon (</>)
4. Register app name: "LSM Cricket App"
5. Copy the firebaseConfig object

### Step 5: Update script.js
Open `script.js` and replace lines 2-9 with your Firebase config:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};
```

## 📦 Files Included
- `index.html` - Main HTML structure
- `styles.css` - All styling with responsive design
- `script.js` - JavaScript functionality and Firebase integration
- `README.md` - This setup guide

## 🎯 Quick Start (Without Firebase First)
If you want to test immediately:
1. Open `index.html` in any web browser
2. The site will work with localStorage (data saved in browser only)
3. Later, add Firebase for permanent cloud storage

## 🔐 Admin Access
- **Username**: AdminLsm
- **Password**: AdminLSM
- Admin can view all registrations with detailed player information

## 📱 How Users Will Access

### Public Users:
1. Open the website URL
2. Click "Login" (no credentials needed)
3. Click "Add New Team" or "Add Players"
4. Fill team registration form
5. Add 11-16 players with captain selection
6. Submit registration

### Admin:
1. Enter admin credentials on login page
2. Access "Admin Panel" button
3. View all registrations, team details, and statistics

## 🌐 Free Domain Options
1. **Freenom.com** - Free domains (.tk, .ml, .ga, .cf, .gq)
2. **InfinityFree.net** - Free subdomain
3. **Use hosting provider's subdomain** (Netlify/Vercel gives free subdomain)

## 💾 Data Storage
- Firebase Free Tier includes:
  - 1 GB storage
  - 10 GB/month download
  - 100 simultaneous connections
  - **FREE FOREVER** for small projects like this

## 📊 Viewing Registered Data

### For Admin:
- Login with admin credentials
- Click "Admin Panel"
- See all teams, players, and statistics

### For Public:
- Click "Squad" button
- View all registered teams and players

### Export Data:
- Go to Firebase Console > Realtime Database
- Click on "teams" node
- Click ⋮ menu > Export JSON
- Download complete data backup

## 🔧 Customization
- Background images are from Unsplash (free high-quality cricket images)
- To change background: Replace URLs in `styles.css` lines 31 and 52
- Colors can be adjusted in CSS (primary green: #1a472a, gold: #d4af37)

## 📞 Support
- All features working offline with localStorage
- Online features require Firebase setup (10 minutes)
- Free hosting deployment takes 5 minutes

## ✅ What's FREE Forever:
- ✅ Website hosting (Netlify/Vercel/GitHub Pages)
- ✅ Database (Firebase Realtime Database)
- ✅ SSL Certificate (HTTPS)
- ✅ Unlimited visitors
- ✅ Domain (subdomain from hosting provider)
- ✅ Custom domain option (via Freenom)

---

**Total Cost: ₹0 (COMPLETELY FREE)** 🎉
**Setup Time: 15-20 minutes**
**Lifetime Access: Forever (with free tiers)**
