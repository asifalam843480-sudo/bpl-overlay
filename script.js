let matchData = JSON.parse(localStorage.getItem("bplData")) || {
  teamA: "ROYAL WARRIORS", teamB: "TIGER STRIKERS",
  teamALogo: "", teamBLogo: "",
  score: 0, wickets: 0, balls: 0, target: 0, innings: 1,
  thisOver: [], history: [],
  b1Name: "Player 1", b1Runs: 0, b1Balls: 0,
  b2Name: "Player 2", b2Runs: 0, b2Balls: 0,
  onStrike: 1, // 1 means b1 is playing, 2 means b2 is playing
  bowler: "Bowler", bowlerRuns: 0, bowlerWickets: 0,
  flashEvent: "", flashId: 0 
};

function saveData() {
  localStorage.setItem("bplData", JSON.stringify(matchData));
}

function getOvers() {
  return Math.floor((parseInt(matchData.balls) || 0) / 6) + "." + ((parseInt(matchData.balls) || 0) % 6);
}

function saveHistory() {
  matchData.history.push(JSON.parse(JSON.stringify(matchData)));
  if (matchData.history.length > 25) matchData.history.shift();
}

function rotateStrike() {
  // Helmet paas karo
  matchData.onStrike = matchData.onStrike === 1 ? 2 : 1;
}

function checkOverComplete() {
  if (matchData.balls > 0 && matchData.balls % 6 === 0) {
      matchData.thisOver = [];
      rotateStrike(); // Over khatam, strike ghumao
  }
}

function triggerAnimation(type) {
    matchData.flashEvent = type;
    matchData.flashId = Date.now(); 
}

function addRun(run) {
  saveHistory();
  run = parseInt(run) || 0; // Agar box khali hai, toh math fail nahi hoga, 0 maan lega
  
  matchData.score = (parseInt(matchData.score) || 0) + run;
  matchData.bowlerRuns = (parseInt(matchData.bowlerRuns) || 0) + run;
  matchData.balls = (parseInt(matchData.balls) || 0) + 1;
  matchData.thisOver.push(run);

  // Jo batsman strike par hai, usi ke dabbe mein run aur ball daalo
  if (matchData.onStrike === 1) {
      matchData.b1Runs = (parseInt(matchData.b1Runs) || 0) + run;
      matchData.b1Balls = (parseInt(matchData.b1Balls) || 0) + 1;
  } else {
      matchData.b2Runs = (parseInt(matchData.b2Runs) || 0) + run;
      matchData.b2Balls = (parseInt(matchData.b2Balls) || 0) + 1;
  }

  if (run === 4 || run === 6) triggerAnimation(run); 
  if (run % 2 !== 0) rotateStrike(); // 1 ya 3 run lene par helmet paas karo

  checkOverComplete();
  updateUI();
}

function addWicket() {
  saveHistory();
  matchData.wickets = (parseInt(matchData.wickets) || 0) + 1;
  matchData.bowlerWickets = (parseInt(matchData.bowlerWickets) || 0) + 1;
  matchData.balls = (parseInt(matchData.balls) || 0) + 1;
  matchData.thisOver.push("W");

  // Out hone wale ka ball count badhao
  if (matchData.onStrike === 1) {
      matchData.b1Balls = (parseInt(matchData.b1Balls) || 0) + 1;
  } else {
      matchData.b2Balls = (parseInt(matchData.b2Balls) || 0) + 1;
  }

  triggerAnimation("W"); 
  checkOverComplete();
  updateUI();
}

function extraBall(type) {
  saveHistory();
  matchData.score = (parseInt(matchData.score) || 0) + 1;
  matchData.bowlerRuns = (parseInt(matchData.bowlerRuns) || 0) + 1;
  matchData.thisOver.push(type);
  updateUI();
}

function undoBall() {
  if (matchData.history.length === 0) return;
  matchData = matchData.history.pop();
  updateUI();
}

function startSecondInnings() {
  matchData.target = (parseInt(matchData.score) || 0) + 1;
  matchData.score = 0; matchData.wickets = 0; matchData.balls = 0;
  matchData.b1Runs = 0; matchData.b1Balls = 0;
  matchData.b2Runs = 0; matchData.b2Balls = 0;
  matchData.bowlerRuns = 0; matchData.bowlerWickets = 0;
  matchData.innings = 2; matchData.thisOver = []; matchData.history = [];
  updateUI();
}

function updateUI() {
  document.getElementById("score").innerText = matchData.score + "/" + matchData.wickets;
  document.getElementById("overs").innerText = getOvers() + " Overs";
  document.getElementById("thisOver").innerText = matchData.thisOver.join(" ");

  const setIfUnfocused = (id, val) => {
      const el = document.getElementById(id);
      if (el && document.activeElement !== el) el.value = val;
  };

  setIfUnfocused("teamA", matchData.teamA);
  setIfUnfocused("teamB", matchData.teamB);
  setIfUnfocused("b1Name", matchData.b1Name);
  setIfUnfocused("b1Runs", matchData.b1Runs);
  setIfUnfocused("b1Balls", matchData.b1Balls);
  setIfUnfocused("b2Name", matchData.b2Name);
  setIfUnfocused("b2Runs", matchData.b2Runs);
  setIfUnfocused("b2Balls", matchData.b2Balls);
  setIfUnfocused("bowler", matchData.bowler);
  setIfUnfocused("bowlerRuns", matchData.bowlerRuns);
  setIfUnfocused("bowlerWickets", matchData.bowlerWickets);
  setIfUnfocused("target", matchData.target);
  
  // Update Strike Buttons Visuals in Admin
  const btn1 = document.getElementById("btnStrike1");
  const btn2 = document.getElementById("btnStrike2");
  if(matchData.onStrike === 1) {
      btn1.className = "badge active"; btn1.innerText = "ON STRIKE (▶)";
      btn2.className = "badge"; btn2.innerText = "SET STRIKE";
  } else {
      btn2.className = "badge active"; btn2.innerText = "ON STRIKE (▶)";
      btn1.className = "badge"; btn1.innerText = "SET STRIKE";
  }

  saveData();
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();

  // Auto-Save Listeners
  const inputIds = ["teamA", "teamB", "b1Name", "b1Runs", "b1Balls", "b2Name", "b2Runs", "b2Balls", "bowler", "bowlerRuns", "bowlerWickets", "target"];
  inputIds.forEach(id => {
      let el = document.getElementById(id);
      if(el) {
          el.addEventListener("input", (e) => {
              let val = e.target.value;
              if(e.target.type === 'number') { val = parseInt(val) || 0; }
              matchData[id] = val;
              saveData(); 
          });
      }
  });

  document.querySelectorAll(".runBtn").forEach(btn => {
      btn.addEventListener("click", () => {
          let txt = btn.innerText.trim();
          if (txt === "6=OUT") addWicket(); else addRun(txt);
      });
  });

  document.querySelectorAll("button").forEach(btn => {
      let txt = btn.innerText.trim();
      if (txt === "WD") btn.onclick = () => extraBall("WD");
      if (txt === "NB") btn.onclick = () => extraBall("NB");
      if (txt === "UNDO BALL") btn.onclick = undoBall;
      if (txt === "START 2ND INNINGS") btn.onclick = startSecondInnings;
      if (txt === "RESET FULL MATCH") btn.onclick = () => { 
          if(confirm("Sab clear ho jayega. Pakka?")) { localStorage.removeItem("bplData"); location.reload(); } 
      };
  });

  // Manual Strike Switchers
  document.getElementById("btnStrike1").addEventListener("click", () => { matchData.onStrike = 1; updateUI(); });
  document.getElementById("btnStrike2").addEventListener("click", () => { matchData.onStrike = 2; updateUI(); });
});
