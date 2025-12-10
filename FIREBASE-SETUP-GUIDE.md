# Firebase Database Setup Instructions

## 🔥 How to Update Firebase Realtime Database Rules

### Step 1: Access Firebase Console
1. Go to https://console.firebase.google.com/
2. Select your project: **lsm-cricket-tournament**

### Step 2: Navigate to Database Rules
1. Click **"Realtime Database"** in the left sidebar
2. Click on the **"Rules"** tab at the top

### Step 3: Copy and Paste the Rules
Copy the entire content from `FIREBASE-DATABASE-RULES.json` file and paste it in the Firebase Console:

```json
{
  "rules": {
    "teams": {
      ".read": true,
      ".write": true,
      ".indexOn": ["teamName", "registeredDate"]
    },
    "pools": {
      ".read": true,
      ".write": true
    },
    "fixtures": {
      ".read": true,
      ".write": true,
      ".indexOn": ["pool", "matchNumber"]
    },
    "settings": {
      ".read": true,
      ".write": true
    },
    "liveViewers": {
      ".read": true,
      ".write": true,
      "$sessionId": {
        ".validate": "newData.hasChildren(['timestamp', 'sessionId'])"
      }
    }
  }
}
```

### Step 4: Publish the Rules
1. Click the **"Publish"** button
2. Wait for the success message

---

## 📊 Database Structure

Your Firebase Realtime Database will have this structure:

```
lsm-cricket-tournament/
├── teams/
│   ├── {team-id-1}/
│   │   ├── teamName: "Team Name"
│   │   ├── players: [...]
│   │   ├── registeredDate: "2025-11-21..."
│   │   └── entryFee: 1500
│   └── {team-id-2}/...
│
├── pools/
│   ├── poolA: [{team1}, {team2}, ...]
│   ├── poolB: [{team1}, {team2}, ...]
│   ├── poolC: [{team1}, {team2}, ...]
│   └── poolD: [{team1}, {team2}, ...]
│
├── fixtures/
│   ├── 0:
│   │   ├── matchNumber: 1
│   │   ├── team1: "Team A"
│   │   ├── team2: "Team B"
│   │   ├── pool: "poolA"
│   │   ├── matchDate: "January 10, 2026"
│   │   ├── matchTime: "TBD"
│   │   └── venue: "Lingasamudram Cricket Ground"
│   ├── 1: {...}
│   └── 11: {...} (total 12 matches for 24 teams)
│
├── settings/
│   ├── editLocked: false
│   └── fixtureSpinEnabled: true
│
└── liveViewers/
    └── {session-id}/
        ├── timestamp: 1732147200000
        └── sessionId: "viewer_123..."
```

---

## 🔐 Security Rules Explained

### Current Rules (Public Access - Testing):
- **Read**: Anyone can read data
- **Write**: Anyone can write data

### For Production (Recommended):
Replace with authenticated rules:

```json
{
  "rules": {
    "teams": {
      ".read": true,
      ".write": "auth != null"
    },
    "pools": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    },
    "fixtures": {
      ".read": true,
      ".write": "auth != null"
    },
    "settings": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    }
  }
}
```

---

## ✅ Testing the Setup

### 1. Check if Rules are Applied:
- Go to Firebase Console → Realtime Database → Rules
- You should see the new rules

### 2. Test in Browser Console:
Open your website and run:
```javascript
firebase.database().ref('fixtures').once('value').then(snapshot => {
  console.log('Fixtures:', snapshot.val());
});
```

### 3. Verify Data Storage:
- Click "Data" tab in Firebase Console
- You should see: `teams`, `pools`, `fixtures`, `settings`

---

## 🚨 Common Issues

### "Permission Denied" Error:
- Rules not published correctly
- Wait 10-30 seconds after publishing
- Clear browser cache and refresh

### Data Not Saving:
- Check browser console for errors
- Verify Firebase config in `script.js`
- Check internet connection

### Data Not Loading:
- Check Firebase Console → Usage tab
- Verify database URL in config
- Check if data exists in "Data" tab

---

## 📱 How Data Flows

1. **User clicks Spin button** → Creates random match
2. **Match saved to** → `firebase.database().ref('fixtures')`
3. **Data structure:**
   ```javascript
   {
     matchNumber: 1,
     team1: "Team A",
     team2: "Team B",
     pool: "poolA",
     matchDate: "January 10, 2026",
     matchTime: "TBD",
     venue: "Lingasamudram Cricket Ground"
   }
   ```
4. **Schedule automatically updates** → Fetches from `fixtures/`
5. **All users see updated schedule** → Real-time sync

---

## 💡 Pro Tips

1. **Backup Data**: Export from Firebase Console → Data → Export JSON
2. **Monitor Usage**: Check Firebase Console → Usage (free tier: 100 simultaneous connections)
3. **Clear Old Matches**: Admin can delete from Firebase Console → Data → fixtures → Delete
4. **Reset Everything**: Delete all data and start fresh if needed

---

**Setup Complete!** 🎉

Your tournament schedule is now stored in Firebase and accessible to all users in real-time!
