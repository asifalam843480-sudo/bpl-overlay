// Game Engine State
let state = {
    team1: "TEAM A", team2: "TEAM B",
    isFirstInnings: true,
    runs: 0, wickets: 0, balls: 0, target: 0,
    bowlerRuns: 0, bowlerWickets: 0,
    streak4: 0, streakWicket: 0
};

// UI Elements
const ui = {
    runs: document.getElementById('runs'),
    wickets: document.getElementById('wickets'),
    overs: document.getElementById('overs'),
    bowlerRuns: document.getElementById('bowler-runs'),
    bowlerWickets: document.getElementById('bowler-wickets'),
    battingTeam: document.getElementById('batting-team'),
    targetBox: document.getElementById('target-box'),
    targetSpan: document.getElementById('target'),
    animLayer: document.getElementById('animation-layer'),
    animText: document.getElementById('anim-text')
};

// Logic: Calculate Overs (format: 1.2, 1.5, 2.0)
function getOvers() {
    let o = Math.floor(state.balls / 6);
    let b = state.balls % 6;
    return `${o}.${b}`;
}

function updateUI() {
    ui.runs.innerText = state.runs;
    ui.wickets.innerText = state.wickets;
    ui.overs.innerText = getOvers();
    ui.bowlerRuns.innerText = state.bowlerRuns;
    ui.bowlerWickets.innerText = state.bowlerWickets;
    
    // Auto Winner Check
    if(!state.isFirstInnings && state.runs >= state.target) triggerAnimation("WINNER!", 'anim-gold');
}

// Play Animations like a Pro
function triggerAnimation(text, animClass) {
    ui.animText.innerText = text;
    ui.animText.className = ''; 
    ui.animLayer.classList.remove('hidden');
    
    // Force reflow to restart animation
    void ui.animText.offsetWidth; 
    ui.animText.classList.add(animClass);

    setTimeout(() => { ui.animLayer.classList.add('hidden'); }, 3000);
}

// Add Runs (Handles 4s & Hat-trick 4s)
function addRuns(run, isLegBye = false) {
    state.runs += run;
    if (!isLegBye) state.bowlerRuns += run; // Leg byes don't count against bowler
    state.balls++; // Assume legal delivery for this example
    
    if (run === 4 && !isLegBye) {
        state.streak4++;
        state.streakWicket = 0; // Reset wicket streak
        if(state.streak4 === 3) triggerAnimation("HAT-TRICK 4s!", 'anim-gold');
        else triggerAnimation("FOUR!", 'anim-gold');
    } else {
        state.streak4 = 0;
        state.streakWicket = 0;
    }

    checkOverEnd();
    updateUI();
}

// Leg Bye 4 Logic
function addLegByeFour() { addRuns(4, true); }

// Wicket & Run Out Logic (Handles Hat-trick Wickets)
function addWicket(isRunOut = false) {
    state.wickets++;
    state.balls++;
    state.streak4 = 0;

    if (!isRunOut) {
        state.bowlerWickets++;
        state.streakWicket++;
        if(state.streakWicket === 3) triggerAnimation("HAT-TRICK WICKET!", 'anim-smash');
        else triggerAnimation("WICKET!", 'anim-smash');
    } else {
        state.streakWicket = 0; // Run outs break bowler's hat-trick logic
        triggerAnimation("RUN OUT!", 'anim-smash');
    }

    checkOverEnd();
    updateUI();
}

// BUG FIX: Bowler stats only clear AFTER the 6th ball is thrown
function checkOverEnd() {
    if (state.balls % 6 === 0 && state.balls > 0) {
        // DO NOT hide bowler immediately. Let them see the final stats.
        // In a real app, wait for admin to click "New Bowler" to reset bowler stats.
        console.log("Over complete. Waiting for new bowler.");
    }
}

// Innings Swap Logic (Instant & Seamless)
function changeInnings() {
    state.isFirstInnings = false;
    state.target = state.runs + 1;
    state.runs = 0;
    state.wickets = 0;
    state.balls = 0;
    state.bowlerRuns = 0;
    state.bowlerWickets = 0;
    state.streak4 = 0;
    state.streakWicket = 0;

    // Swap team names
    let temp = state.team1;
    state.team1 = state.team2;
    state.team2 = temp;
    ui.battingTeam.innerText = state.team1;

    // Show target
    ui.targetBox.classList.remove('hidden');
    ui.targetSpan.innerText = state.target;

    triggerAnimation("TARGET: " + state.target, 'anim-gold');
    updateUI();
}
