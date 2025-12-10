# OTP Login & Team Edit Features Guide

## Overview
Your tournament website now has two major new features:
1. **OTP-based login** for users (mobile number or email)
2. **Team editing** capability for registered teams

---

## 🔐 OTP Login System

### How It Works

#### For Regular Users
1. **Enter Contact**: Mobile number (10 digits) or email address
2. **Send OTP**: Click "Send OTP" button
3. **Receive Code**: 6-digit OTP generated (currently shown in browser console for testing)
4. **Enter OTP**: Type the 6-digit code
5. **Verify**: Click "Verify OTP" to login
6. **Timer**: OTP valid for 2 minutes

#### For Admin
1. Click "Admin Login" tab
2. Enter credentials:
   - Username: `AdminLsm`
   - Password: `AdminLSM`
3. Click "Admin Login" button
4. Access admin panel and pool management

#### Guest Access
- Click "Skip Login" to browse without authentication
- Limited functionality (cannot register teams as guest)

### OTP Demo Mode

**IMPORTANT**: Currently in DEMO mode for testing!

The OTP is displayed in the browser console (press F12 → Console tab) instead of being sent via SMS/Email.

**To see the OTP**:
1. Open browser Developer Tools (F12)
2. Go to "Console" tab
3. After clicking "Send OTP", you'll see: `Generated OTP: 123456`
4. Copy the 6-digit number and paste into "Enter OTP" field

### Production Setup (SMS/Email Integration)

To send real OTP messages in production, you'll need to integrate an SMS/Email service:

#### Option 1: Firebase Phone Authentication (Recommended)
Firebase already supports phone authentication with OTP.

**Setup Steps**:
1. Go to Firebase Console → Authentication
2. Enable "Phone" sign-in method
3. Update script.js line ~70 with actual Firebase Phone Auth code
4. Replace demo OTP generation with real Firebase authentication

**Code to Replace** (around line 70 in script.js):
```javascript
// Current DEMO code:
generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
console.log('Generated OTP:', generatedOTP);

// Replace with Firebase Phone Auth:
const phoneNumber = '+91' + contact; // For India
const appVerifier = window.recaptchaVerifier;
firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        showNotification('OTP sent to ' + contact, 'success');
    });
```

#### Option 2: SMS API (Twilio, MSG91, etc.)

**Twilio Setup**:
1. Sign up at https://www.twilio.com/
2. Get Account SID, Auth Token, and Phone Number
3. Add backend endpoint to send SMS
4. Call endpoint from script.js

**MSG91 Setup** (Popular in India):
1. Sign up at https://msg91.com/
2. Get API key
3. Create SMS template
4. Use their API to send OTP

**Code Example**:
```javascript
// Send OTP via MSG91 API
fetch('https://api.msg91.com/api/v5/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        authkey: 'YOUR_MSG91_API_KEY',
        mobile: contact,
        otp: generatedOTP
    })
});
```

#### Option 3: Email OTP (EmailJS, SendGrid)

**EmailJS Setup** (Free, easy):
1. Sign up at https://www.emailjs.com/
2. Create email template with OTP placeholder
3. Get Service ID, Template ID, User ID
4. Add EmailJS SDK to index.html

**Code Example**:
```javascript
emailjs.send('service_id', 'template_id', {
    to_email: contact,
    otp_code: generatedOTP,
    tournament_name: 'LSM 2026'
});
```

### Security Notes

⚠️ **Current Demo Limitations**:
- OTP shown in console (not secure)
- No backend validation
- Client-side only verification

🔒 **For Production**:
- Use Firebase Authentication or backend API
- Never expose OTP in client code
- Implement rate limiting (max 3 attempts)
- Add CAPTCHA to prevent abuse
- Use HTTPS for secure transmission

---

## ✏️ Team Edit Feature

### How to Edit a Team

#### Step 1: Navigate to Registered Teams
1. Login to the website
2. Click "Registered Teams" in navigation
3. Scroll to find your team

#### Step 2: Open Edit Modal
1. Find the "✏️ Edit Team" button at bottom of your team card
2. Click the button to open edit form
3. Modal window will appear with current team data

#### Step 3: Edit Team Details
You can modify:
- **Team Name**: Edit in the text field at top
- **Player Names**: Click on any player name field to edit
- **Mobile Numbers**: Update player contact numbers
- **Captain**: Check/uncheck captain checkbox (only one captain allowed)

#### Step 4: Manage Players
- **Add Player**: Click "+ Add Player" (max 16 players)
- **Remove Player**: Click "❌ Remove" button (min 11 players)
- **Reorder**: Players are numbered automatically

#### Step 5: Save Changes
1. Review all changes
2. Ensure:
   - At least 11 players
   - Maximum 16 players
   - One captain selected
   - All fields filled correctly
3. Click "Save Changes" button
4. Success notification will appear
5. Modal closes automatically
6. Updated team displays in list

### Edit Modal Features

#### Validation Rules
- **Minimum Players**: 11 players required
- **Maximum Players**: 16 players allowed
- **Captain Requirement**: Exactly one captain must be selected
- **Mobile Format**: Must be 10 digits
- **Name Requirement**: All player names required

#### Captain Selection
- Click checkbox next to "Captain" label
- Only ONE captain allowed per team
- Selecting new captain automatically deselects previous one
- Captain badge (⭐) shows on team card

#### Close Modal
- Click "✖" button in top-right corner
- Click outside modal (on dark overlay)
- Press ESC key (coming soon)

### Who Can Edit Teams?

**Currently**: Anyone can edit any team (for flexibility)

**To Restrict Editing**:
If you want only the team creator to edit their own team:

1. During registration, save `creatorContact` with team data
2. During login, save `currentUserContact` 
3. In `displaySquadData()` function, show edit button only if:
   ```javascript
   if (team.creatorContact === currentUserContact || isAdmin) {
       // Show edit button
   }
   ```

This would require updating team registration to capture creator's mobile number.

### Data Storage

#### Firebase Mode
- Changes saved to Firebase Realtime Database
- Updates reflected immediately for all users
- Path: `teams/{teamId}`
- Includes `updatedAt` timestamp

#### LocalStorage Mode (Offline)
- Changes saved to browser's localStorage
- Data persists only on that device
- Useful for testing without internet

### Troubleshooting

**Problem**: Edit button not visible  
**Solution**:
- Refresh the page
- Check if team has an `id` field
- Ensure you're viewing "Registered Teams" section

**Problem**: Changes not saving  
**Solution**:
- Check internet connection (Firebase mode)
- Verify Firebase config is correct
- Check browser console for errors (F12)
- Ensure minimum 11 players selected
- Ensure captain is selected

**Problem**: Modal won't close  
**Solution**:
- Click outside modal area
- Click the ✖ button
- Refresh page if stuck

**Problem**: Player count incorrect  
**Solution**:
- Add/remove players to meet 11-16 range
- Numbers auto-update when you add/remove players

---

## 🎯 User Workflows

### Workflow 1: Team Manager Login & Edit
1. Enter mobile number (used during registration)
2. Click "Send OTP"
3. Check console for OTP (demo mode)
4. Enter OTP and verify
5. Navigate to "Registered Teams"
6. Find your team
7. Click "✏️ Edit Team"
8. Make changes
9. Click "Save Changes"

### Workflow 2: Admin Access
1. Click "Admin Login" tab
2. Enter: `AdminLsm` / `AdminLSM`
3. Access all features:
   - View all teams
   - Edit any team
   - Manage pools
   - Control fixtures
   - Admin panel

### Workflow 3: Guest Browsing
1. Click "Skip Login"
2. Browse without authentication
3. View registered teams (cannot edit)
4. View fixtures and archives

---

## 🔧 Technical Details

### OTP Implementation

**Location**: `script.js` lines 20-120

**Key Functions**:
- `sendOtpBtn` event listener: Generates and displays OTP
- `verifyOtpBtn` event listener: Validates entered OTP
- `resetOTPForm()`: Clears OTP form after expiry/error
- Timer: 2-minute countdown with `setInterval`

**Variables**:
- `generatedOTP`: Stores the 6-digit code
- `otpTimerInterval`: Countdown interval reference
- `currentUserContact`: Logged-in user identifier

### Edit Team Implementation

**Location**: `script.js` lines 830-1000

**Key Functions**:
- `openEditTeamModal(teamId)`: Loads team data into modal
- `addEditPlayerField(playerData)`: Creates player input fields
- `removeEditPlayer(button)`: Removes player (min 11 enforced)
- `closeEditTeamModal()`: Hides modal
- `editTeamForm` submit handler: Validates and saves

**Variables**:
- `currentEditTeamId`: Team being edited
- `editPlayerCount`: Number of players in edit form

### HTML Structure

**OTP Login Form** (`index.html` lines 30-70):
```html
<div class="login-type-selector">
    <button class="login-type-btn active" data-type="otp">User Login (OTP)</button>
    <button class="login-type-btn" data-type="admin">Admin Login</button>
</div>
```

**Edit Team Modal** (`index.html` lines 250-280):
```html
<div id="editTeamModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>✏️ Edit Team</h2>
            <span class="modal-close" onclick="closeEditTeamModal()">✖</span>
        </div>
        <!-- Edit form -->
    </div>
</div>
```

### CSS Styling

**Login Type Selector** (`styles.css` lines 904-920):
```css
.login-type-selector {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
}

.login-type-btn.active {
    background: linear-gradient(135deg, #1a472a 0%, #2d7a4a 100%);
}
```

**Modal Styling** (`styles.css` lines 930-980):
```css
.modal {
    position: fixed;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.7);
}

.modal-content {
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
}
```

---

## 📱 Mobile Responsiveness

Both features are fully responsive:

### OTP Login on Mobile
- Large tap targets for buttons
- Auto-zoom disabled on inputs
- Numeric keyboard for OTP input
- Timer clearly visible

### Edit Modal on Mobile
- Scrollable modal content
- Touch-friendly buttons
- Responsive player list
- Easy captain selection

---

## 🚀 Next Steps

### Before Going Live

1. **Setup Real OTP Service**:
   - Choose SMS provider (MSG91, Twilio) or Firebase Phone Auth
   - Get API credentials
   - Update script.js with real OTP sending code
   - Test OTP delivery

2. **Add reCAPTCHA** (prevent spam):
   - Go to https://www.google.com/recaptcha/
   - Create v2 Invisible reCAPTCHA
   - Add to OTP send button

3. **Restrict Edit Access** (optional):
   - Link teams to creator's mobile/email
   - Show edit button only to team owner or admin
   - Add authentication check before saving

4. **Test Thoroughly**:
   - Test OTP with real phone numbers
   - Edit multiple teams
   - Try edge cases (16 players, 11 players, captain changes)
   - Test on mobile devices

5. **Security Hardening**:
   - Use HTTPS for deployment
   - Add rate limiting to OTP requests
   - Validate all inputs on server-side (if using backend)
   - Hide console.log statements in production

### Deployment Checklist

- [ ] Real OTP service configured
- [ ] Firebase rules set for team editing
- [ ] Background image added (`images/login-bg.jpg`)
- [ ] Tested on mobile devices
- [ ] HTTPS enabled on Netlify
- [ ] Console logs removed (OTP display)
- [ ] Error handling tested
- [ ] User guide created for team managers

---

## 💡 Tips & Best Practices

### For Users
- **Save your mobile number**: Use same number for OTP login and team registration
- **Captain changes**: Can update captain anytime before tournament
- **Player roster**: Update player names if spelling errors found
- **Contact updates**: Mobile numbers can be edited for communication

### For Admin
- **Monitor edits**: Check Firebase console for edit timestamps
- **Lock edits**: Can disable edit feature before tournament starts
- **Backup data**: Export team data from Firebase before tournament
- **Communication**: Use mobile numbers for team notifications

### For Developers
- **OTP Security**: Never log OTP in production console
- **Data Validation**: Always validate on both client and server
- **Error Handling**: Show user-friendly error messages
- **Performance**: Optimize modal for large team lists (100+ teams)

---

## 📞 Support

For issues or questions:
1. Check browser console (F12) for errors
2. Verify Firebase connection
3. Test in incognito mode (cache issues)
4. Review this guide's troubleshooting sections

**Common Questions**:

**Q: Can I use email instead of mobile for OTP?**  
A: Yes! Enter email address instead of mobile number. (Note: SMS delivery not configured for emails in demo mode)

**Q: How long is the OTP valid?**  
A: 2 minutes (120 seconds) with countdown timer displayed.

**Q: Can I edit team after tournament starts?**  
A: Admin can disable edit feature. By default, editing is always allowed.

**Q: What happens if I lose internet during edit?**  
A: Changes won't save if using Firebase. Use stable connection or edit before event.

---

**Features Status**:
- ✅ OTP Login (Demo Mode - Console Display)
- ✅ Admin Login (Password-based)
- ✅ Guest/Skip Login
- ✅ Team Edit Modal
- ✅ Add/Remove Players
- ✅ Captain Selection
- ✅ Save to Firebase
- ⏳ SMS/Email OTP Delivery (Requires API setup)
- ⏳ Edit Access Control (Optional enhancement)

**Last Updated**: December 2024
