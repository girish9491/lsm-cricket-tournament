# Testing Checklist - New Features

## Pre-Testing Setup
- [ ] Ensure Firebase is properly configured and connected
- [ ] Clear browser cache if needed
- [ ] Have admin credentials ready (AdminLsm / AdminLSM)
- [ ] Have at least 2-3 test teams registered

---

## Feature 1: Edit Lock/Unlock Control

### As Admin:
- [ ] Login with admin credentials
- [ ] Open Admin Panel
- [ ] Verify Edit Permission Control section is visible
- [ ] Click Lock/Unlock button
- [ ] Verify button text changes (🔓 ↔️ 🔒)
- [ ] Verify status text updates correctly
- [ ] Check Firebase database (`settings/editLocked`) for value change

### As Captain (Edit Unlocked):
- [ ] Logout from admin
- [ ] Login as guest
- [ ] Go to Registered Teams
- [ ] Verify "✏️ Edit Team" button is visible
- [ ] Click Edit Team button
- [ ] Enter correct captain mobile number
- [ ] Verify edit modal opens

### As Captain (Edit Locked):
- [ ] Admin locks editing via Admin Panel
- [ ] Refresh page as guest user
- [ ] Go to Registered Teams
- [ ] Verify "✏️ Edit Team" button is NOT visible

### As Admin (Always Editable):
- [ ] Login as admin
- [ ] Lock editing via Admin Panel
- [ ] Go to Registered Teams
- [ ] Verify "✏️ Edit Team" button IS visible (admin override)
- [ ] Verify can edit without mobile verification

**Pass Criteria:** ✅ Edit permissions work correctly for all user types

---

## Feature 2: Team Grid View

### Display Test:
- [ ] Go to Registered Teams
- [ ] Click "📊 Team Grid" button
- [ ] Verify modal opens
- [ ] Verify table displays with columns:
  - [ ] # (numbering)
  - [ ] Team Name
  - [ ] Captain Name
  - [ ] Cricheros Number
- [ ] Verify all registered teams are listed
- [ ] Verify data is accurate

### UI/UX Test:
- [ ] Verify table is properly formatted
- [ ] Verify alternating row colors (zebra striping)
- [ ] Click outside modal - verify it closes
- [ ] Click X button - verify it closes
- [ ] Test on mobile/tablet - verify responsiveness

**Pass Criteria:** ✅ Team grid displays correctly with accurate data

---

## Feature 3: Pool Management Updates

### Available Teams Display:
- [ ] Login as admin
- [ ] Click "Pool Management"
- [ ] Verify "Available Teams" section shows team names only
- [ ] Count teams - should match total registered teams
- [ ] Verify no full team details displayed (just names)

### Drag and Drop:
- [ ] Drag a team from Available Teams to Pool A
- [ ] Drag a team from Available Teams to Pool B
- [ ] Drag a team from Available Teams to Pool C
- [ ] Drag a team between pools (Pool A → Pool B)
- [ ] Verify dragging works smoothly

### Save Pools:
- [ ] Assign teams to all 3 pools
- [ ] Click "💾 Save Pools"
- [ ] Verify success notification appears
- [ ] Refresh the page
- [ ] Click Pool Management again
- [ ] Verify pool assignments persisted (teams in correct pools)
- [ ] Check Firebase database (`pools/poolA`, `pools/poolB`, `pools/poolC`)

**Pass Criteria:** ✅ Pool management works with team names only, saves correctly

---

## Feature 4: Fixture Generation

### Generate Fixtures:
- [ ] Ensure pools are saved (at least 2 teams in one pool)
- [ ] Click "🎲 Release Fixture Spin"
- [ ] Verify success notification
- [ ] Verify button changes to "🔒 Disable Fixture Spin"
- [ ] Check Firebase database (`fixtures/`)
- [ ] Verify fixtures array exists

### Fixture Logic:
- [ ] Count fixtures generated
- [ ] For Pool A with 3 teams: should have 3 matches (A vs B, A vs C, B vs C)
- [ ] For Pool B with 4 teams: should have 6 matches
- [ ] Verify all teams in a pool play each other once (round-robin)
- [ ] Verify fixtures are randomized (order varies)

### User Access:
- [ ] Logout from admin
- [ ] Login as guest
- [ ] Go to Fixtures section
- [ ] Verify "Spin for Fixture" section is NOT visible (removed after release)
- [ ] Verify fixtures are visible to all users

**Pass Criteria:** ✅ Fixtures generate correctly using round-robin and save to database

---

## Feature 5: Enhanced Fixtures Display

### Display Format:
- [ ] Go to Fixtures section
- [ ] Verify fixtures are grouped by pool
- [ ] Verify each pool has a header (e.g., "Pool A Matches")
- [ ] Verify each match shows:
  - [ ] Match number
  - [ ] Team 1 vs Team 2
  - [ ] Date (default: TBD)
  - [ ] Time (default: TBD)
  - [ ] Venue (default: TBD)

### As Guest User:
- [ ] Verify NO edit buttons visible on matches
- [ ] Verify can view all fixtures
- [ ] Verify pool organization is clear

### As Admin:
- [ ] Login as admin
- [ ] Go to Fixtures section
- [ ] Verify "✏️ Edit" button visible on each match
- [ ] Verify can view all fixtures

**Pass Criteria:** ✅ Fixtures display correctly for all users with proper grouping

---

## Feature 6: Admin Fixture Editing

### Edit Functionality:
- [ ] Login as admin
- [ ] Go to Fixtures section
- [ ] Click "✏️ Edit" on any match
- [ ] Enter new date (e.g., "January 10, 2026")
- [ ] Enter new time (e.g., "10:00 AM")
- [ ] Enter new venue (e.g., "Main Ground")
- [ ] Verify success notification

### Data Persistence:
- [ ] Verify edited match displays new details immediately
- [ ] Refresh the page
- [ ] Go to Fixtures section
- [ ] Verify edited details persisted
- [ ] Check Firebase database (`fixtures/`)
- [ ] Verify match object has updated date, time, venue

### As Guest User:
- [ ] Logout from admin
- [ ] Login as guest
- [ ] Go to Fixtures
- [ ] Verify updated fixture details are visible
- [ ] Verify NO edit buttons visible

**Pass Criteria:** ✅ Admin can edit fixtures and changes persist for all users

---

## Integration Tests

### Complete Workflow 1: Admin Setup
1. [ ] Login as admin
2. [ ] Register 3 test teams (11 players each)
3. [ ] Go to Admin Panel
4. [ ] Lock editing
5. [ ] Go to Pool Management
6. [ ] Assign teams to pools
7. [ ] Save pools
8. [ ] Generate fixtures
9. [ ] Go to Fixtures section
10. [ ] Edit one match with specific date/time/venue
11. [ ] Verify all steps work smoothly

### Complete Workflow 2: Captain Experience
1. [ ] Admin unlocks editing
2. [ ] Logout
3. [ ] Login as guest
4. [ ] View Team Grid
5. [ ] Go to Registered Teams
6. [ ] Edit a team (verify captain mobile)
7. [ ] View Fixtures
8. [ ] Verify all visible and accessible

### Complete Workflow 3: Guest User
1. [ ] Login as guest (no credentials)
2. [ ] View Registered Teams
3. [ ] View Team Grid
4. [ ] View Fixtures
5. [ ] Verify NO edit access anywhere
6. [ ] Verify can view all public information

**Pass Criteria:** ✅ All workflows complete without errors

---

## Cross-Browser Testing

Test on:
- [ ] Google Chrome (latest)
- [ ] Mozilla Firefox (latest)
- [ ] Microsoft Edge (latest)
- [ ] Safari (if available)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

**Pass Criteria:** ✅ All features work on all tested browsers

---

## Mobile Responsiveness

- [ ] Team Grid displays properly on mobile
- [ ] Modals fit on mobile screens
- [ ] Edit Lock button accessible on mobile
- [ ] Pool Management drag-and-drop works on touch
- [ ] Fixtures readable on mobile

**Pass Criteria:** ✅ All features are mobile-friendly

---

## Error Handling

### Test Edge Cases:
- [ ] Try to edit without captain verification - should fail
- [ ] Try to generate fixtures without pools - should show error
- [ ] Try to save pools with 0 teams - should work
- [ ] Try to drag team multiple times - should work
- [ ] Click edit on fixture as guest - button shouldn't exist

**Pass Criteria:** ✅ Graceful error handling, no crashes

---

## Performance Testing

- [ ] Page loads in < 3 seconds
- [ ] Modal opens instantly
- [ ] Team Grid renders quickly (< 1 second for 20 teams)
- [ ] Fixture generation completes in < 2 seconds
- [ ] Database writes complete successfully
- [ ] No console errors during normal operation

**Pass Criteria:** ✅ Smooth performance, no lag

---

## Final Verification

- [ ] All 8 original requirements implemented
- [ ] No JavaScript console errors
- [ ] No broken UI elements
- [ ] All buttons work as expected
- [ ] Data persists correctly in Firebase
- [ ] Documentation is accurate

**Pass Criteria:** ✅ 100% feature completion

---

## Sign-Off

**Tested By:** _______________  
**Date:** _______________  
**Overall Status:** ⬜ PASS / ⬜ FAIL  
**Notes:**

_______________________________________________
_______________________________________________
_______________________________________________

---

**Testing Completed:** ___ / ___ / _____
**Production Ready:** ⬜ YES / ⬜ NO
