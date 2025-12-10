// Firebase Configuration (You'll need to replace with your own Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyBj8Jw68aiH1c3O-QMVi15Y6y5Gl1rZ_zs",
  authDomain: "lsm-cricket-tournament.firebaseapp.com",
  databaseURL: "https://lsm-cricket-tournament-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lsm-cricket-tournament",
  storageBucket: "lsm-cricket-tournament.firebasestorage.app",
  messagingSenderId: "711928597764",
  appId: "1:711928597764:web:e3368e0962dd37d8191451"
};

// Initialize Firebase
let database;
try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
} catch (error) {
    console.log("Firebase initialization error:", error);
}

// Viewer tracking variables
let viewerSessionId = null;
let viewerRef = null;

// Generate unique session ID
function generateSessionId() {
    return 'viewer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Hardcoded Live Viewers - increases from 1 to 15 hourly
function updateLiveViewers() {
    const startTime = new Date('2025-11-21T00:00:00').getTime(); // Set your tournament start date
    const currentTime = new Date().getTime();
    const hoursPassed = Math.floor((currentTime - startTime) / (1000 * 60 * 60)); // Hours since start
    const liveCount = Math.min((hoursPassed % 15) + 1, 15); // Cycles 1-15
    
    document.getElementById('liveViewersCount').textContent = liveCount;
    document.getElementById('liveViewersDisplay').textContent = liveCount;
    console.log('Live viewers count:', liveCount);
}

// Initialize viewer tracking
function initViewerTracking() {
    viewerSessionId = generateSessionId();
    
    if (database) {
        console.log('Firebase connected - tracking viewer');
        
        // Add viewer entry for tracking purposes
        viewerRef = database.ref('liveViewers/' + viewerSessionId);
        viewerRef.set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            sessionId: viewerSessionId
        }).then(() => {
            console.log('Viewer added to Firebase with ID:', viewerSessionId);
        }).catch(error => {
            console.error('Error adding viewer:', error);
        });
        
        // Remove viewer when they leave
        viewerRef.onDisconnect().remove();
    }
    
    // Update live viewers count (hardcoded)
    updateLiveViewers();
    
    // Update every minute
    setInterval(updateLiveViewers, 60000);
}

// Global Variables
let isAdmin = false;
let playerCount = 0;
let editPlayerCount = 0;
let currentEditTeamId = null;
let currentUserCaptainMobile = null; // Store current user's captain mobile
let editLocked = false; // Edit lock status

// Page Navigation
const loginPage = document.getElementById('loginPage');
const homePage = document.getElementById('homePage');

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Check if admin credentials provided
    if (username === 'AdminLsm' && password === 'AdminLSM') {
        isAdmin = true;
        document.getElementById('adminPanelBtn').style.display = 'inline-block';
        document.getElementById('poolManagementBtn').style.display = 'inline-block';
        document.getElementById('fixturesBtn').style.display = 'inline-block';
        showNotification('Welcome Admin!', 'success');
    } else if (username === '' && password === '') {
        // Guest login - no credentials needed
        isAdmin = false;
        showNotification('Welcome to Lingasamudram Premier League 2026!', 'success');
        // Check if fixture spin is enabled for regular users
        checkFixtureButtonVisibility();
    } else if (username !== '' || password !== '') {
        // Invalid credentials entered
        showNotification('Invalid credentials! Leave blank for guest access or use admin credentials.', 'error');
        return;
    } else {
        isAdmin = false;
        showNotification('Welcome to Lingasamudram Premier League 2026!', 'success');
    }
    
    loginPage.classList.remove('active');
    homePage.classList.add('active');
    
    // Initialize viewer tracking when user enters home page
    initViewerTracking();
    
    checkFixtureButtonVisibility();
    loadEditLockStatus();
});

// Logout Handler
document.getElementById('logoutBtn').addEventListener('click', function() {
    isAdmin = false;
    document.getElementById('adminPanelBtn').style.display = 'none';
    document.getElementById('poolManagementBtn').style.display = 'none';
    document.getElementById('fixturesBtn').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Remove viewer from live count
    if (viewerRef) {
        viewerRef.remove();
    }
    
    homePage.classList.remove('active');
    loginPage.classList.add('active');
    hideAllSections();
});

// Check Fixtures button visibility for regular users
function checkFixtureButtonVisibility() {
    if (isAdmin) {
        document.getElementById('fixturesBtn').style.display = 'inline-block';
        return;
    }
    
    if (database) {
        database.ref('settings/fixtureSpinEnabled').once('value').then(snapshot => {
            const isEnabled = snapshot.val();
            if (isEnabled) {
                document.getElementById('fixturesBtn').style.display = 'inline-block';
            } else {
                document.getElementById('fixturesBtn').style.display = 'none';
            }
        }).catch(() => {
            if (localStorage.getItem('fixtureSpinEnabled') === 'true') {
                document.getElementById('fixturesBtn').style.display = 'inline-block';
            } else {
                document.getElementById('fixturesBtn').style.display = 'none';
            }
        });
    } else {
        if (localStorage.getItem('fixtureSpinEnabled') === 'true') {
            document.getElementById('fixturesBtn').style.display = 'inline-block';
        } else {
            document.getElementById('fixturesBtn').style.display = 'none';
        }
    }
}

// Button Handlers
document.getElementById('addTeamBtn').addEventListener('click', function() {
    hideAllSections();
    document.getElementById('addTeamSection').style.display = 'block';
    initializeTeamForm();
});

document.getElementById('registeredTeamsBtn').addEventListener('click', function() {
    hideAllSections();
    document.getElementById('squadSection').style.display = 'block';
    loadSquadData();
});

document.getElementById('fixturesBtn').addEventListener('click', function() {
    hideAllSections();
    document.getElementById('fixturesSection').style.display = 'block';
    loadFixtures();
});

document.getElementById('scheduleBtn').addEventListener('click', function() {
    hideAllSections();
    document.getElementById('scheduleSection').style.display = 'block';
    loadSchedule();
});

document.getElementById('paymentBtn').addEventListener('click', function() {
    hideAllSections();
    document.getElementById('paymentSection').style.display = 'block';
});

document.getElementById('archivesBtn').addEventListener('click', function() {
    hideAllSections();
    document.getElementById('archivesSection').style.display = 'block';
    loadArchives();
});

document.getElementById('adminPanelBtn').addEventListener('click', function() {
    if (isAdmin) {
        hideAllSections();
        document.getElementById('adminSection').style.display = 'block';
        loadAdminData();
    }
});

document.getElementById('poolManagementBtn').addEventListener('click', function() {
    if (isAdmin) {
        hideAllSections();
        document.getElementById('poolManagementSection').style.display = 'block';
        loadPoolManagement();
    }
});

document.getElementById('viewsBtn').addEventListener('click', function() {
    hideAllSections();
    document.getElementById('viewsSection').style.display = 'block';
    updateViewsStats();
});

// Close Buttons
document.getElementById('cancelTeamBtn').addEventListener('click', () => { hideAllSections(); resetTeamForm(); });
document.getElementById('closeSquadBtn').addEventListener('click', () => hideAllSections());
document.getElementById('closeFixturesBtn').addEventListener('click', () => hideAllSections());
document.getElementById('closeScheduleBtn').addEventListener('click', () => hideAllSections());
document.getElementById('closePaymentBtn').addEventListener('click', () => hideAllSections());
document.getElementById('closeArchivesBtn').addEventListener('click', () => hideAllSections());
document.getElementById('closeAdminBtn').addEventListener('click', () => hideAllSections());
document.getElementById('closePoolManagementBtn').addEventListener('click', () => hideAllSections());
document.getElementById('closeViewsBtn').addEventListener('click', () => hideAllSections());

// Update Views Stats
function updateViewsStats() {
    if (database) {
        // Count teams
        database.ref('teams').once('value').then(snapshot => {
            let teamsCount = 0;
            let playersCount = 0;
            snapshot.forEach(child => {
                teamsCount++;
                const team = child.val();
                if (team.players) {
                    playersCount += team.players.length;
                }
            });
            document.getElementById('teamsCountDisplay').textContent = teamsCount;
            document.getElementById('playersCountDisplay').textContent = playersCount;
        });
    } else {
        const teams = JSON.parse(localStorage.getItem('lsmTeams') || '[]');
        let playersCount = 0;
        teams.forEach(team => {
            if (team.players) {
                playersCount += team.players.length;
            }
        });
        document.getElementById('teamsCountDisplay').textContent = teams.length;
        document.getElementById('playersCountDisplay').textContent = playersCount;
    }
}

// Initialize Team Form - Show 11 players initially
function initializeTeamForm() {
    resetTeamForm();
    for (let i = 0; i < 11; i++) {
        addPlayerInput();
    }
}

// Add Player Input
document.getElementById('addPlayerBtn').addEventListener('click', function() {
    if (playerCount < 16) {
        addPlayerInput();
    } else {
        showNotification('Maximum 16 players allowed per team', 'error');
    }
});

function addPlayerInput() {
    playerCount++;
    const container = document.getElementById('playersContainer');
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-input-group';
    playerDiv.id = `player-${playerCount}`;
    playerDiv.innerHTML = `
        <h4>Player ${playerCount}</h4>
        ${playerCount > 11 ? `<button type="button" class="remove-player-btn" onclick="removePlayer(${playerCount})">Remove</button>` : ''}
        <div class="player-fields">
            <div class="form-group">
                <label>Player Name *</label>
                <input type="text" name="playerName-${playerCount}" required>
            </div>
            <div class="form-group">
                <label>Cricheros Mobile Number *</label>
                <input type="tel" name="mobile-${playerCount}" pattern="[0-9]{10}" required placeholder="10 digits">
            </div>
            <div class="form-group">
                <label>Is Captain?</label>
                <select name="isCaptain-${playerCount}" onchange="handleCaptainChange(this)">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>
            </div>
        </div>
    `;
    container.appendChild(playerDiv);
}

function removePlayer(playerId) {
    if (playerCount > 11) {
        document.getElementById(`player-${playerId}`)?.remove();
        playerCount--;
    } else {
        showNotification('Minimum 11 players required', 'error');
    }
}

function handleCaptainChange(selectElement) {
    if (selectElement.value === 'yes') {
        document.querySelectorAll('select[name^="isCaptain-"]').forEach(select => {
            if (select !== selectElement) select.value = 'no';
        });
    }
}

// Team Form Submit
document.getElementById('teamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const teamName = document.getElementById('teamName').value.trim();
    if (!teamName) {
        showNotification('Please enter team name', 'error');
        return;
    }
    
    const players = [];
    let hasCaptain = false;
    
    for (let i = 1; i <= playerCount; i++) {
        const playerDiv = document.getElementById(`player-${i}`);
        if (playerDiv) {
            const playerName = document.querySelector(`input[name="playerName-${i}"]`).value.trim();
            const mobile = document.querySelector(`input[name="mobile-${i}"]`).value.trim();
            const isCaptain = document.querySelector(`select[name="isCaptain-${i}"]`).value === 'yes';
            if (isCaptain) hasCaptain = true;
            players.push({ playerName, mobile, isCaptain });
        }
    }
    
    if (!hasCaptain) {
        showNotification('Please select a captain for the team', 'error');
        return;
    }
    if (players.length < 11) {
        showNotification('Minimum 11 players required', 'error');
        return;
    }
    
    const teamData = {
        teamName,
        players,
        registeredDate: new Date().toISOString(),
        entryFee: 1500,
        pool: 'unassigned'
    };
    
    saveTeamData(teamData);
});

function saveTeamData(teamData) {
    if (database) {
        database.ref('teams').push().set(teamData)
            .then(() => {
                showNotification('Team registered successfully!', 'success');
                resetTeamForm();
                hideAllSections();
            })
            .catch(() => saveToLocalStorage(teamData));
    } else {
        saveToLocalStorage(teamData);
    }
}

function saveToLocalStorage(teamData) {
    let teams = JSON.parse(localStorage.getItem('lsmTeams') || '[]');
    teamData.id = Date.now().toString();
    teams.push(teamData);
    localStorage.setItem('lsmTeams', JSON.stringify(teams));
    showNotification('Team registered successfully!', 'success');
    resetTeamForm();
    hideAllSections();
}

function loadSquadData() {
    const squadList = document.getElementById('squadList');
    squadList.innerHTML = '<p>Loading teams...</p>';
    
    if (database) {
        database.ref('teams').once('value').then(snapshot => {
            const teams = [];
            snapshot.forEach(childSnapshot => {
                const team = childSnapshot.val();
                team.id = childSnapshot.key; // Add the Firebase key as team ID
                teams.push(team);
            });
            displaySquadData(teams);
        }).catch(() => {
            const teams = JSON.parse(localStorage.getItem('lsmTeams') || '[]');
            displaySquadData(teams);
        });
    } else {
        const teams = JSON.parse(localStorage.getItem('lsmTeams') || '[]');
        displaySquadData(teams);
    }
}

// Load Edit Lock Status
function loadEditLockStatus() {
    if (database) {
        database.ref('settings/editLocked').once('value').then(snapshot => {
            editLocked = snapshot.val() || false;
        });
    } else {
        editLocked = localStorage.getItem('editLocked') === 'true';
    }
}

// Check if user can edit team
function canEditTeam(team) {
    // Admin can always edit
    if (isAdmin) {
        return true;
    }
    
    // If edit is locked, only admin can edit
    if (editLocked) {
        return false;
    }
    
    // If edit is unlocked, check if user is the captain
    // For now, we'll allow captains to identify themselves by mobile number
    return true; // Will be enhanced with proper authentication
}

// Prompt captain to identify themselves
function getCaptainMobile(team, callback) {
    if (isAdmin) {
        callback(true);
        return;
    }
    
    const captain = team.players.find(p => p.isCaptain);
    if (!captain) {
        showNotification('No captain assigned to this team', 'error');
        callback(false);
        return;
    }
    
    const inputMobile = prompt(`To edit this team, please enter the captain's mobile number (${captain.playerName}):`);
    if (inputMobile && inputMobile.trim() === captain.mobile) {
        callback(true);
    } else {
        showNotification('Invalid captain mobile number!', 'error');
        callback(false);
    }
}

function displaySquadData(teams) {
    const squadList = document.getElementById('squadList');
    if (teams.length === 0) {
        squadList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No teams registered yet.</p>';
        return;
    }
    
    squadList.innerHTML = '';
    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        let playersHTML = '<div class="player-list">';
        team.players.forEach(player => {
            playersHTML += `
                <div class="player-item ${player.isCaptain ? 'captain' : ''}">
                    <h4>${player.playerName} ${player.isCaptain ? '<span class="captain-badge">Captain</span>' : ''}</h4>
                    <p><strong>Mobile:</strong> ${player.mobile}</p>
                </div>
            `;
        });
        playersHTML += '</div>';
        
        // Edit button HTML - show based on permissions
        let editButtonHTML = '';
        if (isAdmin) {
            // Admin always sees edit button
            editButtonHTML = `<button class="btn btn-edit" onclick="openEditTeamModal('${team.id}')">✏️ Edit Team</button>`;
        } else if (!editLocked) {
            // If edit unlocked, show button (will verify captain on click)
            editButtonHTML = `<button class="btn btn-edit" onclick="openEditTeamModalWithAuth('${team.id}')">✏️ Edit Team</button>`;
        }
        // If edit locked and not admin, no edit button shown
        
        teamCard.innerHTML = `
            <h3>🏏 ${team.teamName}</h3>
            <p style="color: #666; margin-bottom: 15px;">
                <strong>Players:</strong> ${team.players.length} | <strong>Entry Fee:</strong> ₹${team.entryFee}
            </p>
            ${playersHTML}
            <div style="margin-top: 15px; text-align: right;">
                ${editButtonHTML}
            </div>
        `;
        squadList.appendChild(teamCard);
    });
}

function loadFixtures() {
    loadPools();
    loadMatchFixtures();
}

function loadPools() {
    const poolsDisplay = document.getElementById('poolsDisplay');
    poolsDisplay.innerHTML = '<h3>Tournament Pools</h3>';
    if (database) {
        database.ref('pools').once('value').then(snapshot => displayPools(snapshot.val())).catch(() => {
            displayPools(JSON.parse(localStorage.getItem('lsmPools') || '{}'));
        });
    } else {
        displayPools(JSON.parse(localStorage.getItem('lsmPools') || '{}'));
    }
}

function displayPools(pools) {
    const poolsDisplay = document.getElementById('poolsDisplay');
    if (!pools || Object.keys(pools).length === 0) {
        poolsDisplay.innerHTML += '<p style="text-align: center; color: #666; padding: 20px;">Pools not assigned yet.</p>';
        return;
    }
    
    ['A', 'B', 'C', 'D'].forEach(poolName => {
        const poolTeams = pools[`pool${poolName}`] || [];
        if (poolTeams.length > 0) {
            const poolDiv = document.createElement('div');
            poolDiv.className = 'pool-display';
            poolDiv.innerHTML = `<h3>Pool ${poolName}</h3>`;
            const teamsDiv = document.createElement('div');
            teamsDiv.className = 'pool-teams';
            poolTeams.forEach(team => {
                const teamItem = document.createElement('div');
                teamItem.className = 'pool-team-item';
                teamItem.textContent = team.teamName;
                teamsDiv.appendChild(teamItem);
            });
            poolDiv.appendChild(teamsDiv);
            poolsDisplay.appendChild(poolDiv);
        }
    });
}

function loadMatchFixtures() {
    const fixturesDisplay = document.getElementById('fixturesDisplay');
    if (database) {
        database.ref('fixtures').once('value').then(snapshot => {
            const fixturesData = snapshot.val();
            const fixtures = fixturesData ? Object.values(fixturesData).filter(f => f) : [];
            displayFixtures(fixtures);
        });
    } else {
        displayFixtures(JSON.parse(localStorage.getItem('lsmFixtures') || '[]'));
    }
}

function displayFixtures(fixtures) {
    const fixturesDisplay = document.getElementById('fixturesDisplay');
    if (fixtures.length === 0) {
        fixturesDisplay.innerHTML += '<h3>Match Fixtures</h3><p style="text-align: center; color: #666; padding: 20px;">No fixtures scheduled yet.</p>';
        return;
    }
    
    fixturesDisplay.innerHTML = '<h3>Match Fixtures</h3>';
    
    // Group by pool
    const poolGroups = {
        poolA: fixtures.filter(f => f.pool === 'poolA'),
        poolB: fixtures.filter(f => f.pool === 'poolB'),
        poolC: fixtures.filter(f => f.pool === 'poolC'),
        poolD: fixtures.filter(f => f.pool === 'poolD')
    };
    
    ['poolA', 'poolB', 'poolC', 'poolD'].forEach(poolName => {
        const poolMatches = poolGroups[poolName];
        if (poolMatches.length > 0) {
            const poolLabel = poolName.replace('pool', 'Pool ');
            fixturesDisplay.innerHTML += `<h4 style="margin-top: 20px; color: #1a472a;">${poolLabel} Matches</h4>`;
            const fixturesList = document.createElement('div');
            fixturesList.className = 'fixtures-list';
            
            poolMatches.forEach((match, index) => {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'fixture-match';
                matchDiv.innerHTML = `
                    <h4>Match ${index + 1}</h4>
                    <p><strong>${match.team1}</strong> vs <strong>${match.team2}</strong></p>
                    <p style="font-size: 0.9em; color: #666;">
                        Date: ${match.matchDate || 'TBD'} | Time: ${match.matchTime || 'TBD'} | Venue: ${match.venue || 'TBD'}
                    </p>
                    ${isAdmin ? `<button class="btn-secondary" style="margin-top: 10px; font-size: 0.9em;" onclick="editFixture(${index}, '${poolName}')">✏️ Edit</button>` : ''}
                `;
                fixturesList.appendChild(matchDiv);
            });
            fixturesDisplay.appendChild(fixturesList);
        }
    });
}

// Make editFixture globally accessible
window.editFixture = editFixture;

function editFixture(matchIndex, poolName) {
    if (!isAdmin) {
        showNotification('Admin access required!', 'error');
        return;
    }
    
    // Load current fixtures
    if (database) {
        database.ref('fixtures').once('value').then(snapshot => {
            const fixtures = [];
            snapshot.forEach(child => fixtures.push(child.val()));
            
            // Find the match
            const poolMatches = fixtures.filter(f => f.pool === poolName);
            const match = poolMatches[matchIndex];
            
            if (match) {
                editMatchDetails(match, fixtures.indexOf(match));
            }
        });
    } else {
        const fixtures = JSON.parse(localStorage.getItem('lsmFixtures') || '[]');
        const poolMatches = fixtures.filter(f => f.pool === poolName);
        const match = poolMatches[matchIndex];
        
        if (match) {
            editMatchDetails(match, fixtures.indexOf(match));
        }
    }
}

function editMatchDetails(match, globalIndex) {
    const newDate = prompt('Enter match date:', match.matchDate || 'TBD');
    const newTime = prompt('Enter match time:', match.matchTime || 'TBD');
    const newVenue = prompt('Enter venue:', match.venue || 'TBD');
    
    if (newDate !== null && newTime !== null && newVenue !== null) {
        match.matchDate = newDate;
        match.matchTime = newTime;
        match.venue = newVenue;
        
        // Update in database
        if (database) {
            database.ref('fixtures').once('value').then(snapshot => {
                const fixtures = [];
                snapshot.forEach(child => fixtures.push(child.val()));
                fixtures[globalIndex] = match;
                
                database.ref('fixtures').set(fixtures).then(() => {
                    showNotification('Match updated successfully!', 'success');
                    loadMatchFixtures();
                });
            });
        } else {
            const fixtures = JSON.parse(localStorage.getItem('lsmFixtures') || '[]');
            fixtures[globalIndex] = match;
            localStorage.setItem('lsmFixtures', JSON.stringify(fixtures));
            showNotification('Match updated successfully!', 'success');
            loadMatchFixtures();
        }
    }
}

function copyUPI() {
    navigator.clipboard.writeText('9491843895@ybl').then(() => {
        showNotification('UPI ID copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy. Please copy manually.', 'error');
    });
}

document.querySelectorAll('.archive-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        document.querySelectorAll('.archive-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.archive-content').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(`${targetTab}Tab`).classList.add('active');
    });
});

function loadArchives() {
    loadPhotos();
    loadVideos();
}

function loadPhotos() {
    const photosGallery = document.getElementById('photosGallery');
    const photos = [
        'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg',
        'photo6.jpg', 'photo7.jpg', 'photo8.jpg', 'photo9.jpg', 'photo10.jpg',
        'photo11.jpg', 'photo12.jpg', 'photo13.jpg', 'photo14.jpg', 'photo15.jpg',
        'photo16.jpg', 'photo17.jpg', 'photo18.jpg', 'photo19.jpg', 'photo20.jpg'
    ];
    photosGallery.innerHTML = '';
    let hasPhotos = false;
    
    photos.forEach(photoBase => {
        const tryExtensions = ['.jpg', '.JPG', '.jpeg', '.JPEG'];
        let found = false;
        for (let ext of tryExtensions) {
            const photo = photoBase.replace(/\.[^.]+$/, ext);
            const img = new Image();
            img.src = `${photo}`;
            img.onload = function() {
                if (!found) {
                    found = true;
                    hasPhotos = true;
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `<img src="${photo}" alt="Tournament Photo" onclick="window.open('${photo}', '_blank')">`;
                    photosGallery.appendChild(item);
                }
            };
        }
    });
    
    setTimeout(() => {
        if (!hasPhotos) {
            photosGallery.innerHTML = `<div class="empty-gallery"><p>📸 No photos uploaded yet</p><p style="font-size: 0.9em; color: #999;">Upload photos to: LSM-Cricket-Tournament/archives/photos/</p></div>`;
        }
    }, 500);
}

function loadVideos() {
    const videosGallery = document.getElementById('videosGallery');
    const videos = [
        'video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4',
        'video6.mp4', 'video7.mp4', 'video8.mp4', 'video9.mp4', 'video10.mp4',
        'video11.mp4', 'video12.mp4', 'video13.mp4', 'video14.mp4', 'video15.mp4',
        'video16.mp4', 'video17.mp4', 'video18.mp4', 'video19.mp4', 'video20.mp4'
    ];
    videosGallery.innerHTML = '';
    let hasVideos = false;
    
    videos.forEach(videoBase => {
        const tryExtensions = ['.mp4', '.MP4', '.mov', '.MOV'];
        let found = false;
        for (let ext of tryExtensions) {
            const video = videoBase.replace(/\.[^.]+$/, ext);
            const vid = document.createElement('video');
            vid.src = `${video}`;
            vid.onloadeddata = function() {
                if (!found) {
                    found = true;
                    hasVideos = true;
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `<video src="${video}" controls></video>`;
                    videosGallery.appendChild(item);
                }
            };
        }
    });
    
    setTimeout(() => {
        if (!hasVideos) {
            videosGallery.innerHTML = `<div class="empty-gallery"><p>🎥 No videos uploaded yet</p><p style="font-size: 0.9em; color: #999;">Upload videos to: LSM-Cricket-Tournament/archives/videos/</p></div>`;
        }
    }, 500);
}

function loadPoolManagement() {
    const availableTeams = document.getElementById('availableTeams');
    const poolA = document.getElementById('poolA');
    const poolB = document.getElementById('poolB');
    const poolC = document.getElementById('poolC');
    const poolD = document.getElementById('poolD');
    
    // Show loading message
    availableTeams.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">Loading teams...</p>';
    [poolA, poolB, poolC, poolD].forEach(el => el.innerHTML = '');
    
    if (database) {
        console.log('Attempting to load teams from Firebase...');
        
        // Set timeout fallback
        const timeoutId = setTimeout(() => {
            console.log('Firebase timeout - falling back to localStorage');
            const teams = JSON.parse(localStorage.getItem('lsmTeams') || '[]');
            const pools = JSON.parse(localStorage.getItem('lsmPools') || '{}');
            populatePoolManagement(teams, pools);
        }, 5000);
        
        database.ref('teams').once('value').then(snapshot => {
            clearTimeout(timeoutId);
            const teams = [];
            snapshot.forEach(childSnapshot => {
                const team = childSnapshot.val();
                team.firebaseKey = childSnapshot.key;
                teams.push(team);
            });
            console.log('Loaded teams from Firebase:', teams.length);
            
            database.ref('pools').once('value').then(poolSnapshot => {
                populatePoolManagement(teams, poolSnapshot.val() || {});
            }).catch(() => {
                // If pools fail to load, just populate with empty pools
                populatePoolManagement(teams, {});
            });
        }).catch(error => {
            clearTimeout(timeoutId);
            console.error('Error loading teams from Firebase:', error);
            // Fallback to localStorage
            const teams = JSON.parse(localStorage.getItem('lsmTeams') || '[]');
            const pools = JSON.parse(localStorage.getItem('lsmPools') || '{}');
            populatePoolManagement(teams, pools);
        });
    } else {
        console.log('No Firebase - using localStorage');
        const teams = JSON.parse(localStorage.getItem('lsmTeams') || '[]');
        const pools = JSON.parse(localStorage.getItem('lsmPools') || '{}');
        console.log('Loaded teams from localStorage:', teams.length);
        populatePoolManagement(teams, pools);
    }
}

function populatePoolManagement(teams, pools) {
    const availableTeams = document.getElementById('availableTeams');
    const poolA = document.getElementById('poolA');
    const poolB = document.getElementById('poolB');
    const poolC = document.getElementById('poolC');
    const poolD = document.getElementById('poolD');
    
    // Clear all zones completely
    availableTeams.innerHTML = '';
    poolA.innerHTML = '';
    poolB.innerHTML = '';
    poolC.innerHTML = '';
    poolD.innerHTML = '';
    
    const poolATeams = pools.poolA || [];
    const poolBTeams = pools.poolB || [];
    const poolCTeams = pools.poolC || [];
    const poolDTeams = pools.poolD || [];
    
    console.log('Populating pools with teams:', teams.length);
    console.log('Pool A saved teams:', poolATeams.length);
    console.log('Pool B saved teams:', poolBTeams.length);
    console.log('Pool C saved teams:', poolCTeams.length);
    console.log('Pool D saved teams:', poolDTeams.length);
    
    if (teams.length === 0) {
        availableTeams.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No teams registered yet.</p>';
        return;
    }
    
    // Track which teams have been placed to avoid duplicates
    const placedTeams = new Set();
    
    teams.forEach(team => {
        // Skip if already placed
        if (placedTeams.has(team.teamName)) {
            console.log('Skipping duplicate:', team.teamName);
            return;
        }
        
        const teamDiv = createDraggableTeam(team);
        
        if (poolATeams.find(t => t.teamName === team.teamName)) {
            poolA.appendChild(teamDiv);
            placedTeams.add(team.teamName);
            console.log('Placed in Pool A:', team.teamName);
        } else if (poolBTeams.find(t => t.teamName === team.teamName)) {
            poolB.appendChild(teamDiv);
            placedTeams.add(team.teamName);
            console.log('Placed in Pool B:', team.teamName);
        } else if (poolCTeams.find(t => t.teamName === team.teamName)) {
            poolC.appendChild(teamDiv);
            placedTeams.add(team.teamName);
            console.log('Placed in Pool C:', team.teamName);
        } else if (poolDTeams.find(t => t.teamName === team.teamName)) {
            poolD.appendChild(teamDiv);
            placedTeams.add(team.teamName);
            console.log('Placed in Pool D:', team.teamName);
        } else {
            availableTeams.appendChild(teamDiv);
            placedTeams.add(team.teamName);
            console.log('Placed in Available:', team.teamName);
        }
    });
    
    setupDragAndDrop();
}

function createDraggableTeam(team) {
    const teamDiv = document.createElement('div');
    teamDiv.className = 'draggable-team';
    teamDiv.draggable = true;
    teamDiv.textContent = team.teamName; // Show only team name
    teamDiv.dataset.teamData = JSON.stringify(team);
    
    teamDiv.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', this.dataset.teamData);
        this.classList.add('dragging');
    });
    
    teamDiv.addEventListener('dragend', function() {
        this.classList.remove('dragging');
    });
    
    return teamDiv;
}

function setupDragAndDrop() {
    document.querySelectorAll('.team-drop-zone').forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const teamData = e.dataTransfer.getData('text/plain');
            if (!teamData) return;
            
            const team = JSON.parse(teamData);
            const draggingElement = document.querySelector('.dragging');
            
            // Remove the original element first
            if (draggingElement) {
                draggingElement.remove();
            }
            
            // Add to new location
            this.appendChild(createDraggableTeam(team));
            
            console.log('Moved team:', team.teamName, 'to', this.id);
        });
    });
}

document.getElementById('savePoolsBtn').addEventListener('click', function() {
    const pools = {
        poolA: Array.from(document.getElementById('poolA').children).map(el => JSON.parse(el.dataset.teamData)),
        poolB: Array.from(document.getElementById('poolB').children).map(el => JSON.parse(el.dataset.teamData)),
        poolC: Array.from(document.getElementById('poolC').children).map(el => JSON.parse(el.dataset.teamData)),
        poolD: Array.from(document.getElementById('poolD').children).map(el => JSON.parse(el.dataset.teamData))
    };
    
    if (database) {
        database.ref('pools').set(pools).then(() => showNotification('Pools saved successfully!', 'success'))
            .catch(() => {
                localStorage.setItem('lsmPools', JSON.stringify(pools));
                showNotification('Pools saved locally!', 'success');
            });
    } else {
        localStorage.setItem('lsmPools', JSON.stringify(pools));
        showNotification('Pools saved!', 'success');
    }
});

document.getElementById('releaseSpinBtn').addEventListener('click', function() {
    // Just enable the spin button for users
    if (database) {
        database.ref('settings/fixtureSpinEnabled').set(true).then(() => {
            showNotification('Fixture Spin enabled! Users can now spin for matches.', 'success');
            document.getElementById('releaseSpinBtn').style.display = 'none';
            document.getElementById('disableSpinBtn').style.display = 'inline-block';
            // Update Fixtures button visibility for all users
            checkFixtureButtonVisibility();
        });
    } else {
        localStorage.setItem('fixtureSpinEnabled', 'true');
        showNotification('Fixture Spin enabled!', 'success');
        document.getElementById('releaseSpinBtn').style.display = 'none';
        document.getElementById('disableSpinBtn').style.display = 'inline-block';
    }
});

// New fixture generation: Each spin creates ONE random match
function spinForSchedule() {
    const resultDiv = document.getElementById('spinResult');
    const btn = document.getElementById('spinFixtureBtn');
    
    // Animate button
    btn.style.transform = 'rotate(720deg)';
    btn.style.transition = 'transform 0.6s';
    setTimeout(() => { 
        btn.style.transform = 'rotate(0deg)';
        btn.style.transition = 'transform 0.3s';
    }, 600);
    
    resultDiv.innerHTML = '<p style="color: white; font-size: 1.2em;">🏏 Creating match...</p>';
    
    // Load pools and create a match
    if (database) {
        Promise.all([
            database.ref('pools').once('value'),
            database.ref('fixtures').once('value')
        ]).then(([poolsSnapshot, fixturesSnapshot]) => {
            const pools = poolsSnapshot.val() || {};
            const fixturesData = fixturesSnapshot.val();
            const existingFixtures = fixturesData ? Object.values(fixturesData).filter(f => f) : [];
            
            console.log('Loaded existing fixtures:', existingFixtures);
            createRandomMatch(pools, existingFixtures, resultDiv);
        }).catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p style="color: #ffcccc;">Error loading data. Please try again.</p>';
        });
    } else {
        const pools = JSON.parse(localStorage.getItem('lsmPools') || '{}');
        const existingFixtures = JSON.parse(localStorage.getItem('lsmFixtures') || '[]');
        createRandomMatch(pools, existingFixtures, resultDiv);
    }
}

function createRandomMatch(pools, existingFixtures, resultDiv) {
    console.log('Creating random match...');
    console.log('Existing fixtures:', existingFixtures.length);
    
    // Get all teams that already have matches
    const matchedTeams = new Set();
    existingFixtures.forEach(fixture => {
        matchedTeams.add(fixture.team1);
        matchedTeams.add(fixture.team2);
    });
    
    console.log('Already matched teams:', Array.from(matchedTeams));
    
    // Find unmatched teams from all pools
    const unmatchedTeamsByPool = {};
    ['poolA', 'poolB', 'poolC', 'poolD'].forEach(poolName => {
        const teams = pools[poolName] || [];
        const unmatched = teams.filter(team => !matchedTeams.has(team.teamName));
        if (unmatched.length > 0) {
            unmatchedTeamsByPool[poolName] = unmatched;
        }
    });
    
    console.log('Unmatched teams by pool:', unmatchedTeamsByPool);
    
    // Check if all teams are matched
    const totalUnmatched = Object.values(unmatchedTeamsByPool).reduce((sum, teams) => sum + teams.length, 0);
    
    if (totalUnmatched === 0) {
        resultDiv.innerHTML = `
            <div style="background: white; color: #1a472a; padding: 25px; border-radius: 10px; margin-top: 20px;">
                <h3 style="color: #1a472a;">🎉 All Teams Matched!</h3>
                <p style="margin-top: 15px;">All ${existingFixtures.length} matches have been created!</p>
                <p style="margin-top: 10px; color: #666;">Check the Schedule below to see all matches.</p>
            </div>
        `;
        return;
    }
    
    if (totalUnmatched === 1) {
        resultDiv.innerHTML = `
            <div style="background: white; color: #1a472a; padding: 25px; border-radius: 10px; margin-top: 20px;">
                <h3 style="color: #dc3545;">⚠️ Odd Number Alert</h3>
                <p style="margin-top: 15px;">Only 1 team remaining without a match!</p>
                <p style="margin-top: 10px; color: #666;">This team will need a bye or special arrangement.</p>
            </div>
        `;
        return;
    }
    
    // Pick a random pool that has unmatched teams
    const poolsWithTeams = Object.keys(unmatchedTeamsByPool).filter(p => unmatchedTeamsByPool[p].length >= 2);
    
    if (poolsWithTeams.length === 0) {
        const poolStatusMsg = Object.keys(unmatchedTeamsByPool).map(pool => {
            const count = unmatchedTeamsByPool[pool].length;
            return `${pool.replace('pool', 'Pool ')}: ${count} team${count !== 1 ? 's' : ''} remaining`;
        }).join('<br>');
        
        resultDiv.innerHTML = `
            <div style="background: white; color: #1a472a; padding: 25px; border-radius: 10px; margin-top: 20px;">
                <h3 style="color: #dc3545;">⚠️ Not Enough Teams</h3>
                <p style="margin-top: 15px;">Cannot create more matches. Need at least 2 unmatched teams in the same pool.</p>
                <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: left;">
                    <strong>Current Status:</strong><br>
                    ${poolStatusMsg || 'All teams have matches!'}
                </div>
                <p style="margin-top: 15px; color: #666; font-size: 0.9em;">💡 Tip: Make sure each pool has at least 2 teams assigned in Pool Management.</p>
            </div>
        `;
        return;
    }
    
    const randomPool = poolsWithTeams[Math.floor(Math.random() * poolsWithTeams.length)];
    const poolTeams = unmatchedTeamsByPool[randomPool];
    
    // Randomly pick 2 teams from this pool
    const team1Index = Math.floor(Math.random() * poolTeams.length);
    let team2Index;
    do {
        team2Index = Math.floor(Math.random() * poolTeams.length);
    } while (team2Index === team1Index);
    
    const team1 = poolTeams[team1Index];
    const team2 = poolTeams[team2Index];
    
    const newMatch = {
        matchNumber: existingFixtures.length + 1,
        team1: team1.teamName,
        team2: team2.teamName,
        pool: randomPool,
        matchDate: 'January 10, 2026',
        matchTime: 'TBD',
        venue: 'Lingasamudram Cricket Ground'
    };
    
    console.log('New match created:', newMatch);
    
    // Save to database
    if (database) {
        database.ref('fixtures').push(newMatch).then(() => {
            console.log('Match saved to Firebase');
            const totalMatches = existingFixtures.length + 1;
            displayMatchResult(newMatch, totalMatches, resultDiv);
            // Reload schedule display
            loadScheduleFixtures();
        }).catch(error => {
            console.error('Error saving match:', error);
            resultDiv.innerHTML = '<p style="color: #ffcccc;">Error saving match. Please try again.</p>';
        });
    } else {
        existingFixtures.push(newMatch);
        localStorage.setItem('lsmFixtures', JSON.stringify(existingFixtures));
        displayMatchResult(newMatch, existingFixtures.length, resultDiv);
        loadScheduleFixtures();
    }
}

function displayMatchResult(match, totalMatches, resultDiv) {
    const poolLabel = match.pool.replace('pool', 'Pool ');
    const remainingSlots = 12 - totalMatches;
    
    setTimeout(() => {
        resultDiv.innerHTML = `
            <div style="background: white; color: #1a472a; padding: 25px; border-radius: 10px; margin-top: 20px; animation: slideIn 0.5s;">
                <h3 style="color: #1a472a; margin-bottom: 15px;">🎉 Match ${totalMatches} Created!</h3>
                <div style="background: #f0f8f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 10px;">${poolLabel}</div>
                    <div style="font-size: 1.3em; margin: 10px 0;">
                        <strong>${match.team1}</strong><br>
                        <span style="color: #666; font-size: 0.8em;">vs</span><br>
                        <strong>${match.team2}</strong>
                    </div>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 0.9em;">
                    <div>📅 Date: ${match.matchDate}</div>
                    <div>🕐 Time: ${match.matchTime}</div>
                    <div>📍 Venue: ${match.venue}</div>
                </div>
                <div style="margin-top: 20px; padding: 15px; background: #e7f3ff; border-radius: 8px;">
                    <strong style="color: #1a472a;">Progress: ${totalMatches}/12 matches created</strong>
                    ${remainingSlots > 0 ? `<p style="margin-top: 8px; color: #666; font-size: 0.9em;">🎲 Spin again to create ${remainingSlots} more match${remainingSlots > 1 ? 'es' : ''}!</p>` : '<p style="margin-top: 8px; color: #28a745; font-weight: bold;">✅ All matches created!</p>'}
                </div>
            </div>
        `;
    }, 2000);
}

document.getElementById('disableSpinBtn').addEventListener('click', function() {
    if (database) {
        database.ref('settings/fixtureSpinEnabled').set(false).then(() => {
            showNotification('Fixture Spin disabled.', 'success');
            document.getElementById('releaseSpinBtn').style.display = 'inline-block';
            document.getElementById('disableSpinBtn').style.display = 'none';
            // Update Fixtures button visibility (hide from regular users)
            checkFixtureButtonVisibility();
        });
    } else {
        localStorage.setItem('fixtureSpinEnabled', 'false');
        showNotification('Fixture Spin disabled!', 'success');
        document.getElementById('releaseSpinBtn').style.display = 'inline-block';
        document.getElementById('disableSpinBtn').style.display = 'none';
    }
});

function loadAdminData() {
    if (!isAdmin) {
        showNotification('Admin access required', 'error');
        return;
    }
    
    // Load and update edit lock status
    if (database) {
        database.ref('settings/editLocked').once('value').then(snapshot => {
            editLocked = snapshot.val() || false;
            updateEditLockUI();
        });
    } else {
        editLocked = localStorage.getItem('editLocked') === 'true';
        updateEditLockUI();
    }
    
    const adminData = document.getElementById('adminData');
    adminData.innerHTML = '<p>Loading all registrations...</p>';
    
    if (database) {
        database.ref('teams').once('value').then(snapshot => {
            const teams = [];
            snapshot.forEach(childSnapshot => {
                const team = childSnapshot.val();
                team.firebaseKey = childSnapshot.key;
                teams.push(team);
            });
            displayAdminData(teams);
        }).catch(() => {
            displayAdminData(JSON.parse(localStorage.getItem('lsmTeams') || '[]'));
        });
    } else {
        displayAdminData(JSON.parse(localStorage.getItem('lsmTeams') || '[]'));
    }
}

function displayAdminData(teams) {
    const adminData = document.getElementById('adminData');
    if (teams.length === 0) {
        adminData.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No registrations yet.</p>';
        return;
    }
    
    adminData.innerHTML = `
        <div style="margin-bottom: 20px; padding: 15px; background: #e7f3ff; border-radius: 8px;">
            <h3 style="color: #1a472a; margin-bottom: 10px;">Tournament Summary</h3>
            <p><strong>Total Teams Registered:</strong> ${teams.length}</p>
            <p><strong>Total Players:</strong> ${teams.reduce((sum, team) => sum + team.players.length, 0)}</p>
            <p><strong>Total Entry Fees Collected:</strong> ₹${teams.length * 1500}</p>
        </div>
    `;
    
    teams.forEach((team, index) => {
        const teamEntry = document.createElement('div');
        teamEntry.className = 'admin-team-entry';
        const captain = team.players.find(p => p.isCaptain);
        let playersHTML = '<div class="admin-player-grid">';
        team.players.forEach((player, pIndex) => {
            playersHTML += `<div class="admin-player-item"><strong>${pIndex + 1}. ${player.playerName}</strong> ${player.isCaptain ? '👑' : ''}<br><small>Mobile: ${player.mobile}</small></div>`;
        });
        playersHTML += '</div>';
        
        teamEntry.innerHTML = `
            <h4>Team ${index + 1}: ${team.teamName}</h4>
            <p><strong>Captain:</strong> ${captain ? captain.playerName : 'Not assigned'} ${captain ? `(${captain.mobile})` : ''}</p>
            <p><strong>Total Players:</strong> ${team.players.length}</p>
            <p><strong>Registered On:</strong> ${new Date(team.registeredDate).toLocaleString()}</p>
            <p><strong>Entry Fee:</strong> ₹${team.entryFee}</p>
            ${playersHTML}
        `;
        adminData.appendChild(teamEntry);
    });
}

function hideAllSections() {
    ['addTeamSection', 'squadSection', 'fixturesSection', 'scheduleSection', 'paymentSection', 'archivesSection', 'adminSection', 'poolManagementSection']
        .forEach(id => document.getElementById(id).style.display = 'none');
}

function resetTeamForm() {
    document.getElementById('teamForm').reset();
    document.getElementById('teamName').value = '';
    document.getElementById('playersContainer').innerHTML = '';
    playerCount = 0;
}

// Edit Team Modal Functions
function openEditTeamModalWithAuth(teamId) {
    // Load team and verify captain
    if (database) {
        database.ref('teams/' + teamId).once('value').then(snapshot => {
            const team = snapshot.val();
            if (team) {
                getCaptainMobile(team, (authorized) => {
                    if (authorized) {
                        openEditTeamModal(teamId);
                    }
                });
            }
        });
    } else {
        const teams = JSON.parse(localStorage.getItem('lsmTeams') || '[]');
        const team = teams.find(t => t.id === teamId);
        if (team) {
            getCaptainMobile(team, (authorized) => {
                if (authorized) {
                    openEditTeamModal(teamId);
                }
            });
        }
    }
}

function openEditTeamModal(teamId) {
    console.log('Opening edit modal for team:', teamId); // Debug log
    currentEditTeamId = teamId;
    const modal = document.getElementById('editTeamModal');
    const editTeamName = document.getElementById('editTeamName');
    const editPlayersContainer = document.getElementById('editPlayersContainer');
    
    if (!modal) {
        console.error('Modal not found!');
        return;
    }
    
    // Load team data from Firebase
    if (database) {
        database.ref('teams/' + teamId).once('value').then(snapshot => {
            const team = snapshot.val();
            if (team) {
                console.log('Team data loaded:', team);
                editTeamName.value = team.teamName;
                editPlayersContainer.innerHTML = '';
                editPlayerCount = 0;
                
                team.players.forEach(player => {
                    addEditPlayerField(player);
                });
                
                modal.style.display = 'flex';
            } else {
                console.error('Team not found in database');
            }
        }).catch(error => {
            console.error('Error loading team:', error);
        });
    } else {
        const teams = JSON.parse(localStorage.getItem('teams') || '{}');
        const team = teams[teamId];
        if (team) {
            console.log('Team data loaded from localStorage:', team);
            editTeamName.value = team.teamName;
            editPlayersContainer.innerHTML = '';
            editPlayerCount = 0;
            
            team.players.forEach(player => {
                addEditPlayerField(player);
            });
            
            modal.style.display = 'flex';
        } else {
            console.error('Team not found in localStorage');
        }
    }
}

function addEditPlayerField(playerData = null) {
    editPlayerCount++;
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-entry';
    playerDiv.innerHTML = `
        <h4>Player ${editPlayerCount}</h4>
        <input type="text" placeholder="Player Name" class="edit-player-name" value="${playerData ? playerData.playerName : ''}" required>
        <input type="tel" placeholder="Mobile Number (10 digits)" class="edit-player-mobile" pattern="[0-9]{10}" value="${playerData ? playerData.mobile : ''}" required>
        <label class="captain-checkbox">
            <input type="checkbox" class="edit-captain-check" ${playerData && playerData.isCaptain ? 'checked' : ''}>
            <span>Captain</span>
        </label>
        <button type="button" class="btn-remove-player" onclick="removeEditPlayer(this)">❌ Remove</button>
    `;
    document.getElementById('editPlayersContainer').appendChild(playerDiv);
    
    // Ensure only one captain
    playerDiv.querySelector('.edit-captain-check').addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('.edit-captain-check').forEach(cb => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
}

function removeEditPlayer(button) {
    const playerEntries = document.querySelectorAll('#editPlayersContainer .player-entry');
    if (playerEntries.length > 11) {
        button.parentElement.remove();
        updateEditPlayerNumbers();
    } else {
        showNotification('Minimum 11 players required!', 'error');
    }
}

function updateEditPlayerNumbers() {
    const playerEntries = document.querySelectorAll('#editPlayersContainer .player-entry');
    playerEntries.forEach((entry, index) => {
        entry.querySelector('h4').textContent = `Player ${index + 1}`;
    });
    editPlayerCount = playerEntries.length;
}

function closeEditTeamModal() {
    document.getElementById('editTeamModal').style.display = 'none';
    currentEditTeamId = null;
    editPlayerCount = 0;
}

// Make functions globally accessible for onclick handlers
window.openEditTeamModal = openEditTeamModal;
window.openEditTeamModalWithAuth = openEditTeamModalWithAuth;
window.closeEditTeamModal = closeEditTeamModal;
window.removeEditPlayer = removeEditPlayer;
window.closeTeamGridModal = closeTeamGridModal;

// Team Grid Button Handler
document.getElementById('teamGridBtn').addEventListener('click', function() {
    showTeamGrid();
});

function showTeamGrid() {
    const modal = document.getElementById('teamGridModal');
    const container = document.getElementById('teamGridContainer');
    
    container.innerHTML = '<p>Loading teams...</p>';
    modal.style.display = 'flex';
    
    if (database) {
        database.ref('teams').once('value').then(snapshot => {
            const teams = [];
            snapshot.forEach(childSnapshot => {
                teams.push(childSnapshot.val());
            });
            displayTeamGrid(teams);
        });
    } else {
        const teams = JSON.parse(localStorage.getItem('lsmTeams') || '[]');
        displayTeamGrid(teams);
    }
}

function displayTeamGrid(teams) {
    const container = document.getElementById('teamGridContainer');
    
    if (teams.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No teams registered yet.</p>';
        return;
    }
    
    let gridHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background: #1a472a; color: white;">
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">#</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Team Name</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Captain Name</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Cricheros Number</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    teams.forEach((team, index) => {
        const captain = team.players.find(p => p.isCaptain);
        gridHTML += `
            <tr style="background: ${index % 2 === 0 ? '#f8f9fa' : 'white'};">
                <td style="padding: 12px; border: 1px solid #ddd;">${index + 1}</td>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">${team.teamName}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${captain ? captain.playerName : 'Not assigned'}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${captain ? captain.mobile : 'N/A'}</td>
            </tr>
        `;
    });
    
    gridHTML += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = gridHTML;
}

function closeTeamGridModal() {
    document.getElementById('teamGridModal').style.display = 'none';
}

// Admin Panel - Edit Lock Toggle
if (document.getElementById('toggleEditLockBtn')) {
    document.getElementById('toggleEditLockBtn').addEventListener('click', function() {
        toggleEditLock();
    });
}

function toggleEditLock() {
    editLocked = !editLocked;
    
    if (database) {
        database.ref('settings/editLocked').set(editLocked).then(() => {
            updateEditLockUI();
            showNotification(editLocked ? 'Edit locked! Only admin can edit.' : 'Edit unlocked! Captains can edit.', 'success');
        });
    } else {
        localStorage.setItem('editLocked', editLocked.toString());
        updateEditLockUI();
        showNotification(editLocked ? 'Edit locked! Only admin can edit.' : 'Edit unlocked! Captains can edit.', 'success');
    }
}

function updateEditLockUI() {
    const btn = document.getElementById('toggleEditLockBtn');
    const status = document.getElementById('editLockStatus');
    
    if (editLocked) {
        btn.innerHTML = '🔒 Edit Locked (Admin only)';
        btn.style.background = '#dc3545';
        status.innerHTML = 'Status: Only Admin can edit teams';
        status.style.color = '#dc3545';
    } else {
        btn.innerHTML = '🔓 Edit Unlocked (Captains can edit)';
        btn.style.background = '#28a745';
        status.innerHTML = 'Status: Captains can edit their teams';
        status.style.color = '#28a745';
    }
}

// Add Edit Player Button Handler
document.getElementById('addEditPlayerBtn').addEventListener('click', function() {
    if (editPlayerCount < 16) {
        addEditPlayerField();
    } else {
        showNotification('Maximum 16 players allowed!', 'error');
    }
});

// Save Edited Team
document.getElementById('editTeamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const teamName = document.getElementById('editTeamName').value.trim();
    const playerEntries = document.querySelectorAll('#editPlayersContainer .player-entry');
    
    if (playerEntries.length < 11) {
        showNotification('Minimum 11 players required!', 'error');
        return;
    }
    
    if (playerEntries.length > 16) {
        showNotification('Maximum 16 players allowed!', 'error');
        return;
    }
    
    // Check if at least one captain is selected
    let hasCaptain = false;
    playerEntries.forEach(entry => {
        if (entry.querySelector('.edit-captain-check').checked) {
            hasCaptain = true;
        }
    });
    
    if (!hasCaptain) {
        showNotification('Please select at least one captain!', 'error');
        return;
    }
    
    // Collect player data
    const players = [];
    playerEntries.forEach(entry => {
        const playerName = entry.querySelector('.edit-player-name').value.trim();
        const mobile = entry.querySelector('.edit-player-mobile').value.trim();
        const isCaptain = entry.querySelector('.edit-captain-check').checked;
        
        players.push({
            playerName: playerName,
            mobile: mobile,
            isCaptain: isCaptain
        });
    });
    
    const updatedTeam = {
        teamName: teamName,
        players: players,
        entryFee: 1500,
        updatedAt: new Date().toISOString()
    };
    
    // Save to Firebase or localStorage
    if (database) {
        database.ref('teams/' + currentEditTeamId).update(updatedTeam).then(() => {
            showNotification('Team updated successfully!', 'success');
            closeEditTeamModal();
            loadSquadData();
        }).catch(error => {
            showNotification('Error updating team: ' + error.message, 'error');
        });
    } else {
        const teams = JSON.parse(localStorage.getItem('teams') || '{}');
        teams[currentEditTeamId] = { ...teams[currentEditTeamId], ...updatedTeam };
        localStorage.setItem('teams', JSON.stringify(teams));
        showNotification('Team updated successfully!', 'success');
        closeEditTeamModal();
        loadSquadData();
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const editModal = document.getElementById('editTeamModal');
    const gridModal = document.getElementById('teamGridModal');
    
    if (e.target === editModal) {
        closeEditTeamModal();
    }
    if (e.target === gridModal) {
        closeTeamGridModal();
    }
});

// Load Schedule Section - View Only (No Spin)
function loadSchedule() {
    loadScheduleFixtures();
}

function loadScheduleFixtures() {
    const scheduleDisplay = document.getElementById('scheduleDisplay');
    if (database) {
        database.ref('fixtures').once('value').then(snapshot => {
            const fixturesData = snapshot.val();
            const fixtures = fixturesData ? Object.values(fixturesData).filter(f => f) : [];
            console.log('Schedule loaded fixtures:', fixtures);
            displaySchedule(fixtures);
        }).catch(() => {
            displaySchedule(JSON.parse(localStorage.getItem('lsmFixtures') || '[]'));
        });
    } else {
        displaySchedule(JSON.parse(localStorage.getItem('lsmFixtures') || '[]'));
    }
}

function displaySchedule(fixtures) {
    const scheduleDisplay = document.getElementById('scheduleDisplay');
    
    if (fixtures.length === 0) {
        scheduleDisplay.innerHTML = '<h3>Match Schedule</h3><p style="text-align: center; color: #666; padding: 40px;">No matches scheduled yet. Admin will create matches from the Fixtures section.</p>';
        return;
    }
    
    // Create a beautiful header
    scheduleDisplay.innerHTML = `
        <div style="text-align: center; margin: 30px 0;">
            <h2 style="color: #1a472a; font-size: 2em; margin-bottom: 10px;">🏏 Match Schedule 🏏</h2>
            <div style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #1a472a 0%, #2d7a4d 100%); border-radius: 50px; color: white; font-size: 1.2em; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <strong>${fixtures.length}</strong> ${fixtures.length === 1 ? 'Match' : 'Matches'} Created
            </div>
        </div>
    `;
    
    // Group by pool
    const poolGroups = {
        poolA: fixtures.filter(f => f.pool === 'poolA'),
        poolB: fixtures.filter(f => f.pool === 'poolB'),
        poolC: fixtures.filter(f => f.pool === 'poolC'),
        poolD: fixtures.filter(f => f.pool === 'poolD')
    };
    
    const poolColors = {
        poolA: '#e3f2fd',
        poolB: '#f3e5f5',
        poolC: '#fff3e0',
        poolD: '#e8f5e9'
    };
    
    const poolBorderColors = {
        poolA: '#1976d2',
        poolB: '#7b1fa2',
        poolC: '#f57c00',
        poolD: '#388e3c'
    };
    
    ['poolA', 'poolB', 'poolC', 'poolD'].forEach(poolName => {
        const poolMatches = poolGroups[poolName];
        if (poolMatches.length > 0) {
            const poolLabel = poolName.replace('pool', 'Pool ');
            const poolDiv = document.createElement('div');
            poolDiv.style.cssText = `margin: 30px 0; padding: 25px; background: ${poolColors[poolName]}; border-radius: 15px; border-left: 6px solid ${poolBorderColors[poolName]}; box-shadow: 0 4px 10px rgba(0,0,0,0.1);`;
            
            poolDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: ${poolBorderColors[poolName]}; margin: 0; font-size: 1.5em;">
                        🏆 ${poolLabel}
                    </h3>
                    <span style="background: ${poolBorderColors[poolName]}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold;">
                        ${poolMatches.length} ${poolMatches.length === 1 ? 'Match' : 'Matches'}
                    </span>
                </div>
            `;
            
            const matchGrid = document.createElement('div');
            matchGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;';
            
            poolMatches.forEach((match) => {
                const matchCard = document.createElement('div');
                matchCard.style.cssText = `
                    background: white; 
                    padding: 25px; 
                    border-radius: 12px; 
                    border-top: 4px solid ${poolBorderColors[poolName]}; 
                    box-shadow: 0 3px 8px rgba(0,0,0,0.15);
                    transition: transform 0.3s, box-shadow 0.3s;
                    cursor: pointer;
                `;
                
                matchCard.onmouseover = function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
                };
                matchCard.onmouseout = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15)';
                };
                
                matchCard.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <span style="background: ${poolBorderColors[poolName]}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.85em; font-weight: bold;">
                            Match ${match.matchNumber || 'N/A'}
                        </span>
                        <span style="color: #999; font-size: 0.9em;">🏏</span>
                    </div>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                            <div style="font-size: 1.2em; font-weight: bold; color: #1a472a;">
                                ${match.team1}
                            </div>
                        </div>
                        
                        <div style="font-size: 1.5em; color: #666; margin: 10px 0; font-weight: bold;">
                            VS
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 10px;">
                            <div style="font-size: 1.2em; font-weight: bold; color: #1a472a;">
                                ${match.team2}
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 2px dashed #e0e0e0;">
                        <div style="display: flex; align-items: center; gap: 10px; margin: 8px 0; color: #555;">
                            <span style="font-size: 1.2em;">📅</span>
                            <span style="font-size: 0.95em;"><strong>Date:</strong> ${match.matchDate || 'TBD'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; margin: 8px 0; color: #555;">
                            <span style="font-size: 1.2em;">🕐</span>
                            <span style="font-size: 0.95em;"><strong>Time:</strong> ${match.matchTime || 'TBD'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; margin: 8px 0; color: #555;">
                            <span style="font-size: 1.2em;">📍</span>
                            <span style="font-size: 0.95em;"><strong>Venue:</strong> ${match.venue || 'TBD'}</span>
                        </div>
                    </div>
                    
                    ${isAdmin ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 2px dashed #e0e0e0;">
                        <button onclick="editScheduleMatch(${match.matchNumber})" style="width: 100%; padding: 10px; background: ${poolBorderColors[poolName]}; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: opacity 0.3s;">
                            ✏️ Edit Match Details
                        </button>
                    </div>
                    ` : ''}
                `;
                matchGrid.appendChild(matchCard);
            });
            
            poolDiv.appendChild(matchGrid);
            scheduleDisplay.appendChild(poolDiv);
        }
    });
    
    // Add print button at the bottom
    const printButton = document.createElement('div');
    printButton.style.cssText = 'text-align: center; margin: 40px 0;';
    printButton.innerHTML = `
        <button onclick="window.print()" style="padding: 15px 40px; background: #1a472a; color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 1.1em; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: all 0.3s;">
            🖨️ Print Schedule
        </button>
    `;
    scheduleDisplay.appendChild(printButton);
}

// Make editScheduleMatch globally accessible
window.editScheduleMatch = editScheduleMatch;

function editScheduleMatch(matchNumber) {
    if (!isAdmin) {
        showNotification('Admin access required!', 'error');
        return;
    }
    
    if (database) {
        database.ref('fixtures').once('value').then(snapshot => {
            const fixtures = [];
            snapshot.forEach(child => fixtures.push(child.val()));
            
            const match = fixtures.find(f => f.matchNumber === matchNumber);
            if (match) {
                const newDate = prompt('Enter match date:', match.matchDate || 'January 10, 2026');
                const newTime = prompt('Enter match time:', match.matchTime || 'TBD');
                const newVenue = prompt('Enter venue:', match.venue || 'Lingasamudram Cricket Ground');
                
                if (newDate !== null && newTime !== null && newVenue !== null) {
                    match.matchDate = newDate;
                    match.matchTime = newTime;
                    match.venue = newVenue;
                    
                    database.ref('fixtures').set(fixtures).then(() => {
                        showNotification('Match updated successfully!', 'success');
                        loadScheduleFixtures();
                    });
                }
            }
        });
    } else {
        const fixtures = JSON.parse(localStorage.getItem('lsmFixtures') || '[]');
        const match = fixtures.find(f => f.matchNumber === matchNumber);
        
        if (match) {
            const newDate = prompt('Enter match date:', match.matchDate || 'January 10, 2026');
            const newTime = prompt('Enter match time:', match.matchTime || 'TBD');
            const newVenue = prompt('Enter venue:', match.venue || 'Lingasamudram Cricket Ground');
            
            if (newDate !== null && newTime !== null && newVenue !== null) {
                match.matchDate = newDate;
                match.matchTime = newTime;
                match.venue = newVenue;
                
                localStorage.setItem('lsmFixtures', JSON.stringify(fixtures));
                showNotification('Match updated successfully!', 'success');
                loadScheduleFixtures();
            }
        }
    }
}

// Schedule Spin Button Handler
if (document.getElementById('spinFixtureBtn')) {
    document.getElementById('spinFixtureBtn').addEventListener('click', spinForSchedule);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 20px 30px; background: ${type === 'success' ? '#28a745' : '#dc3545'}; color: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 10000; font-size: 1.1em; animation: slideIn 0.3s ease-out;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
`;
document.head.appendChild(style);

// Initialize live viewers listener on page load

