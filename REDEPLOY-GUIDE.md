# 🚀 HOW TO REDEPLOY TO NETLIFY

## You Already Deployed the Old Version - Here's How to Update

### ⚠️ IMPORTANT: Add Background Image First!

Before deploying, you must add a background image:

1. **Download a cricket stadium image**:
   - Visit https://unsplash.com/s/photos/cricket-stadium
   - Or https://pexels.com/search/cricket%20ground/
   - Download a high-quality image (1920x1080 or higher)

2. **Save it as**: `login-bg.jpg`

3. **Place it in**: `LSM-Cricket-Tournament/images/` folder

4. **Verify**: Path should be `LSM-Cricket-Tournament/images/login-bg.jpg`

👉 See `BACKGROUND-IMAGE-GUIDE.md` for detailed instructions

---

### METHOD 1: Drag & Drop Update (Easiest - 1 Minute!)

1. **Go to your Netlify dashboard**:
   - Visit: https://app.netlify.com
   - Log in with your account

2. **Click on your site** (the one you deployed earlier)

3. **Scroll down to "Deploys" section**

4. **Drag the entire updated folder**:
   - Drag `LSM-Cricket-Tournament` folder to the drag & drop area
   - Or click "Deploy site" and select the folder
   - **IMPORTANT**: Make sure `images/login-bg.jpg` is included!

5. **Wait 30 seconds** - Done! ✅

Your website will be automatically updated with all the new features!

---

### METHOD 2: Manual File Upload

1. Go to your Netlify site dashboard
2. Click "Deploys" tab
3. Click "Deploy site manually"
4. Select all files from `LSM-Cricket-Tournament` folder
5. **Ensure you include**:
   - index.html
   - styles.css
   - script.js
   - images/ folder (with login-bg.jpg inside)
   - archives/ folder (with photos/ and videos/ subfolders)
6. Upload

---

## ✅ WHAT'S NEW IN THIS UPDATE

### Latest Features (December 2024):

#### 🔐 New: OTP Login System
- **User Login**: Enter mobile number or email, receive 6-digit OTP
- **Admin Login**: Separate tab for admin access (AdminLsm/AdminLSM)
- **Guest Access**: "Skip Login" button to browse without authentication
- **Timer**: 2-minute OTP validity with countdown
- **Demo Mode**: OTP shown in browser console (for testing)

👉 See `OTP-EDIT-FEATURES-GUIDE.md` for complete OTP setup

#### ✏️ New: Team Edit Feature
- **Edit Button**: Each team card has "✏️ Edit Team" button
- **Edit Modal**: Popup window to modify team details
- **Change Players**: Update names, mobile numbers
- **Captain Selection**: Change captain anytime
- **Add/Remove Players**: Maintain 11-16 player roster
- **Real-time Sync**: Changes save to Firebase instantly

👉 See `OTP-EDIT-FEATURES-GUIDE.md` for editing instructions

#### 🎨 New: Local Background Image
- **Custom Background**: Use your own cricket stadium image
- **Faster Loading**: No external dependencies
- **High Quality**: 4K support (1920x1080 or 3840x2160)
- **Path**: `images/login-bg.jpg`

👉 See `BACKGROUND-IMAGE-GUIDE.md` for image sources

### Previous Changes (Already Deployed):

1. ✅ **Login Text**: Changed to "Welcome to the AI World of Lingasamudram"
2. ✅ **Login Background**: Updated to local cricket stadium wallpaper
3. ✅ **Removed Aadhar Field**: Only Player Name and Mobile Number now
4. ✅ **11 Players Pre-filled**: Form shows 11 player slots initially
5. ✅ **Add Player Button**: Click to add up to 16 players (one at a time)
6. ✅ **Removed "Add Players" Button**: No longer in main navigation
7. ✅ **Renamed "Squad"**: Now called "Registered Teams"
8. ✅ **Added "Fixtures" Button**: New section for pools and matches
9. ✅ **Pool Management (Admin Only)**: Drag & drop teams to Pool A/B/C
10. ✅ **Fixture Spin**: Users can spin for match draw (when admin releases it)
11. ✅ **Entry Fee Payment**: UPI payment section with ID 9491843895@ybl
12. ✅ **Archives Tab**: Photo and video gallery
13. ✅ **Contact Information**: Added organizer contact on home screen

---

## 📂 NEW FOLDER STRUCTURE

```
LSM-Cricket-Tournament/
├── index.html                 (Updated)
├── styles.css                 (Updated)
├── script.js                  (Completely new)
├── archives/                  (NEW!)
│   ├── photos/               (Put your photos here)
│   │   ├── photo1.jpg
│   │   ├── photo2.jpg
│   │   └── README.txt
│   └── videos/               (Put your videos here)
│       ├── video1.mp4
│       ├── video2.mp4
│       └── README.txt
└── (other files remain same)
```

---

## 📸 HOW TO ADD PHOTOS/VIDEOS

### For Photos:
1. Save your cricket tournament photos in: `archives/photos/`
2. Name them: `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, etc.
3. Redeploy to Netlify (drag & drop updated folder)
4. Photos will appear in Archives > Photos tab!

### For Videos:
1. Save your tournament videos in: `archives/videos/`
2. Name them: `video1.mp4`, `video2.mp4`, `video3.mp4`, etc.
3. Redeploy to Netlify
4. Videos will appear in Archives > Videos tab!

---

## 🎯 NEW ADMIN FEATURES

### Pool Management:
1. Login as admin
2. Click "Pool Management" button
3. Drag teams from "Available Teams" to Pool A, B, or C
4. Click "Save Pools" button
5. Pools will be visible in Fixtures page

### Fixture Spin Release:
1. In Pool Management, click "Release Fixture Spin"
2. Users will see a "SPIN FOR FIXTURE" button in Fixtures page
3. They can click to randomly draw their match
4. You can disable it anytime by clicking "Disable Fixture Spin"

---

## 🔄 TESTING BEFORE DEPLOYING

Want to test locally first?
1. Open `index.html` in your browser
2. Try all new features
3. When satisfied, deploy to Netlify

---

## 💳 PAYMENT FEATURE

Users can now:
1. Click "Entry Fee Payment" button
2. See UPI ID: `9491843895@ybl`
3. Copy UPI ID with one click
4. Make payment via any UPI app
5. Send screenshot to organizers

---

## 📞 CONTACT DISPLAY

Home screen now shows:
> **For more Information, Please Reach out to Organizers**  
> Contact: 9491843895

---

## ⚡ QUICK DEPLOY STEPS

1. Delete old deployment (optional, or just update)
2. Go to https://app.netlify.com
3. Click your site
4. Scroll to "Deploys"
5. Drag updated `LSM-Cricket-Tournament` folder
6. Wait 30 seconds
7. ✅ DONE - All new features live!

---

## 🆘 TROUBLESHOOTING

**Problem**: Photos/Videos not showing  
**Solution**: Make sure files are named correctly (photo1.jpg, video1.mp4) and are in the archives folders

**Problem**: Old version still showing  
**Solution**: Clear browser cache (Ctrl+F5) or open in incognito mode

**Problem**: Firebase not working  
**Solution**: Check if you updated Firebase config in script.js (if you set it up)

---

## 🎉 YOU'RE ALL SET!

Just drag and drop the updated folder to Netlify and everything will work perfectly!

Your URL remains the same - just with awesome new features! 🏏

---

**Admin Credentials (unchanged):**
- Username: `AdminLsm`
- Password: `AdminLSM`
