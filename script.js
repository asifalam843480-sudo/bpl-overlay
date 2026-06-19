const DB_KEY = "BPL_FINAL_PRO_V4"; // Memory refresh key

let defaultData = {
  teamA: "ROYAL WARRIORS", teamB: "TIGER STRIKERS",
  teamALogo: "", teamBLogo: "",
  score: 0, wickets: 0, balls: 0, target: 0, innings: 1,
  thisOver: [], history: [],
  b1Name: "BATSMAN 1", b1Runs: 0, b1Balls: 0,
  b2Name: "BATSMAN 2", b2Runs: 0, b2Balls: 0,
  onStrike: 1, 
  bowler: "BOWLER", bowlerRuns: 0, bowlerWickets: 0,
  flashEvent: "", flashId: 0,
  winnerText: "", showWinner: false
};

let matchData;

try {
    let saved = localStorage.getItem(DB_KEY);
    if (saved) { matchData = JSON.parse(saved); } 
    else { matchData = JSON.parse(JSON.stringify(defaultData)); }
} catch (error) {
    matchData = JSON.parse(JSON.stringify(defaultData));
    localStorage.setItem(DB_KEY, JSON.stringify(matchData));
}

function saveData() {
    try { localStorage.setItem(DB_KEY, JSON.stringify(matchData)); } 
    catch (e) { console.error("Storage Error:", e); }
}

function getOvers() {
  return Math.floor((parseInt(matchData.balls) || 0) / 6) + "." + ((parseInt(matchData.balls) || 0) % 6);
}

function saveHistory() {
  let snapshot = JSON.parse(JSON.stringify(matchData));
  delete snapshot.teamALogo;
  delete snapshot.teamBLogo;
  delete snapshot.history; 
  matchData.history.push(snapshot);
  if (matchData.history.length > 30) matchData.history.shift(); 
}

function rotateStrike() {
  matchData.onStrike = matchData.onStrike === 1 ? 2 : 1;
}

function clearOverIfNeeded() {
    let legalBalls = matchData.thisOver.filter(b => b !== "WD" && b !== "NB").length;
    if (legalBalls >= 6) {
        matchData.thisOver = [];
    }
}

function triggerAnimation(type) {
    matchData.flashEvent = type;
    matchData.flashId = Date.now(); 
}

function addRun(run) {
  saveHistory();
  clearOverIfNeeded(); 

  run = parseInt(run) || 0; 
  matchData.score = (parseInt(matchData.score) || 0) + run;
  matchData.bowlerRuns = (parseInt(matchData.bowlerRuns) || 0) + run;
  matchData.balls = (parseInt(matchData.balls) || 0) + 1;
  matchData.thisOver.push(run);

  if (matchData.onStrike === 1) {
      matchData.b1Runs = (parseInt(matchData.b1Runs) || 0) + run;
      matchData.b1Balls = (parseInt(matchData.b1Balls) || 0) + 1;
  } else {
      matchData.b2Runs = (parseInt(matchData.b2Runs) || 0) + run;
      matchData.b2Balls = (parseInt(matchData.b2Balls) || 0) + 1;
  }

  if (run === 4 || run === 6) triggerAnimation(run); 
  if (run % 2 !== 0) rotateStrike(); 

  if (matchData.balls > 0 && matchData.balls % 6 === 0) {
      rotateStrike(); 
  }

  updateUI();
}

function addWicket() {
  saveHistory();
  clearOverIfNeeded();

  matchData.wickets = (parseInt(matchData.wickets) || 0) + 1;
  matchData.bowlerWickets = (parseInt(matchData.bowlerWickets) || 0) + 1;
  matchData.balls = (parseInt(matchData.balls) || 0) + 1;
  matchData.thisOver.push("W");

  if (matchData.onStrike === 1) {
      matchData.b1Balls = (parseInt(matchData.b1Balls) || 0) + 1;
  } else {
      matchData.b2Balls = (parseInt(matchData.b2Balls) || 0) + 1;
  }

  triggerAnimation("W"); 
  
  if (matchData.balls > 0 && matchData.balls % 6 === 0) {
      rotateStrike(); 
  }

  updateUI();
}

function extraBall(type) {
  saveHistory();
  clearOverIfNeeded();

  matchData.score = (parseInt(matchData.score) || 0) + 1;
  matchData.bowlerRuns = (parseInt(matchData.bowlerRuns) || 0) + 1;
  matchData.thisOver.push(type);
  updateUI();
}

// NEW: 5 Run Bye/Penalty Logic
function addFiveExtras(type) {
  saveHistory();
  clearOverIfNeeded();

  matchData.score = (parseInt(matchData.score) || 0) + 5;
  matchData.bowlerRuns = (parseInt(matchData.bowlerRuns) || 0) + 5;
  matchData.thisOver.push(type);
  updateUI();
}

function undoBall() {
  if (matchData.history.length === 0) return;
  
  let oldLogoA = matchData.teamALogo;
  let oldLogoB = matchData.teamBLogo;
  let remainingHistory = matchData.history;
  
  let previousState = remainingHistory.pop();
  
  matchData = previousState;
  
  matchData.teamALogo = oldLogoA;
  matchData.teamBLogo = oldLogoB;
  matchData.history = remainingHistory;
  
  updateUI();
}

function startSecondInnings() {
  matchData.target = (parseInt(matchData.score) || 0) + 1;
  matchData.score = 0; matchData.wickets = 0; matchData.balls = 0;
  matchData.b1Runs = 0; matchData.b1Balls = 0;
  matchData.b2Runs = 0; matchData.b2Balls = 0;
  matchData.bowlerRuns = 0; matchData.bowlerWickets = 0;
  matchData.innings = 2; matchData.thisOver = []; matchData.history = [];
  matchData.showWinner = false;
  updateUI();
}

function updateUI() {
  let scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.innerText = matchData.score + "/" + matchData.wickets;
  
  let oversEl = document.getElementById("overs");
  if (oversEl) oversEl.innerText = getOvers() + " Overs";
  
  let thisOverEl = document.getElementById("thisOver");
  if (thisOverEl) thisOverEl.innerText = matchData.thisOver.join(" ");

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
  setIfUnfocused("winnerText", matchData.winnerText || "");
  
  const btn1 = document.getElementById("btnStrike1");
  const btn2 = document.getElementById("btnStrike2");
  if(btn1 && btn2) {
      if(matchData.onStrike === 1) {
          btn1.className = "badge active"; btn1.innerText = "ON STRIKE (▶)";
          btn2.className = "badge"; btn2.innerText = "SET STRIKE";
      } else {
          btn2.className = "badge active"; btn2.innerText = "ON STRIKE (▶)";
          btn1.className = "badge"; btn1.innerText = "SET STRIKE";
      }
  }
  saveData();
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();

  const inputIds = ["teamA", "teamB", "b1Name", "b1Runs", "b1Balls", "b2Name", "b2Runs", "b2Balls", "bowler", "bowlerRuns", "bowlerWickets", "target", "winnerText"];
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
      if (txt === "WIDE (WD)") btn.onclick = () => extraBall("WD");
      if (txt === "NO BALL (NB)") btn.onclick = () => extraBall("NB");
      if (txt === "5 RUNS (BYE)") btn.onclick = () => addFiveExtras("5B");
      if (txt === "UNDO LAST BALL") btn.onclick = undoBall;
      if (txt === "START 2ND INNINGS") btn.onclick = startSecondInnings;
      if (txt === "RESET FULL MATCH") btn.onclick = () => { 
          if(confirm("Sab clear ho jayega. Pakka?")) { localStorage.removeItem(DB_KEY); location.reload(); } 
      };
  });

  let strikeBtn1 = document.getElementById("btnStrike1");
  let strikeBtn2 = document.getElementById("btnStrike2");
  if(strikeBtn1) strikeBtn1.addEventListener("click", () => { matchData.onStrike = 1; updateUI(); });
  if(strikeBtn2) strikeBtn2.addEventListener("click", () => { matchData.onStrike = 2; updateUI(); });

  // Winner Board Control Buttons Mapping
  let btnShowWinner = document.getElementById("btnShowWinner");
  let btnHideWinner = document.getElementById("btnHideWinner");
  if(btnShowWinner) btnShowWinner.onclick = () => { matchData.showWinner = true; updateUI(); };
  if(btnHideWinner) btnHideWinner.onclick = () => { matchData.showWinner = false; updateUI(); };

  const uploadLogo = (id, key) => {
      let el = document.getElementById(id);
      if(el) {
          el.addEventListener("change", function(e) {
              const file = e.target.files[0];
              if(!file) return;
              const reader = new FileReader();
              reader.onload = function(event) {
                  const img = new Image();
                  img.onload = function() {
                      const canvas = document.createElement("canvas");
                      const MAX_WIDTH = 120; 
                      const scale = MAX_WIDTH / img.width;
                      canvas.width = MAX_WIDTH;
                      canvas.height = img.height * scale;
                      const ctx = canvas.getContext("2d");
                      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                      matchData[key] = canvas.toDataURL("image/png");
                      saveData();
                  };
                  img.src = event.target.result;
              };
              reader.readAsDataURL(file);
          });
      }
  };
  uploadLogo("teamALogo", "teamALogo");
  uploadLogo("teamBLogo", "teamBLogo");
});
