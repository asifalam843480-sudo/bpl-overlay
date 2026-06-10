let matchData = JSON.parse(localStorage.getItem("bplData")) || {
  teamA: "TEAM A", teamB: "TEAM B",
  teamALogo: "", teamBLogo: "",
  score: 0, wickets: 0, balls: 0, target: 0, innings: 1,
  thisOver: [], history: [],
  striker: "Batsman 1", nonStriker: "Batsman 2", bowler: "Bowler",
  strikerRuns: 0, strikerBalls: 0, nonStrikerRuns: 0, nonStrikerBalls: 0,
  bowlerRuns: 0, bowlerWickets: 0
};

function saveData() {
  localStorage.setItem("bplData", JSON.stringify(matchData));
}

function getOvers() {
  return Math.floor(matchData.balls / 6) + "." + (matchData.balls % 6);
}

function saveHistory() {
  const snapshot = JSON.parse(JSON.stringify(matchData));
  matchData.history.push(snapshot);
  if (matchData.history.length > 25) matchData.history.shift();
}

// Solid Strike Rotation
function rotateStrike() {
  let tName = matchData.striker; matchData.striker = matchData.nonStriker; matchData.nonStriker = tName;
  let tRuns = matchData.strikerRuns; matchData.strikerRuns = matchData.nonStrikerRuns; matchData.nonStrikerRuns = tRuns;
  let tBalls = matchData.strikerBalls; matchData.strikerBalls = matchData.nonStrikerBalls; matchData.nonStrikerBalls = tBalls;
}

function checkOverComplete() {
  if (matchData.balls > 0 && matchData.balls % 6 === 0) {
      matchData.thisOver = [];
      rotateStrike(); // Over complete pe strike ghumti hai
  }
}

function addRun(run) {
  saveHistory();
  run = parseInt(run);
  matchData.score = parseInt(matchData.score) + run;
  matchData.strikerRuns = parseInt(matchData.strikerRuns) + run;
  matchData.strikerBalls++;
  matchData.bowlerRuns = parseInt(matchData.bowlerRuns) + run;
  matchData.balls++;
  matchData.thisOver.push(run);

  if (run % 2 !== 0) rotateStrike(); // 1, 3 run pe strike ghumti hai
  checkOverComplete();
  updateUI();
}

function addWicket() {
  saveHistory();
  matchData.wickets++;
  matchData.strikerBalls++;
  matchData.bowlerWickets++;
  matchData.balls++;
  matchData.thisOver.push("W");
  checkOverComplete();
  updateUI();
}

function extraBall(type) {
  saveHistory();
  matchData.score++;
  matchData.bowlerRuns++;
  matchData.thisOver.push(type);
  // WD and NB do NOT add a ball to the over, and do NOT rotate strike
  updateUI();
}

function undoBall() {
  if (matchData.history.length === 0) return;
  matchData = matchData.history.pop();
  updateUI();
}

function startSecondInnings() {
  matchData.target = parseInt(matchData.score) + 1;
  matchData.score = 0; matchData.wickets = 0; matchData.balls = 0;
  matchData.strikerRuns = 0; matchData.strikerBalls = 0;
  matchData.nonStrikerRuns = 0; matchData.nonStrikerBalls = 0;
  matchData.bowlerRuns = 0; matchData.bowlerWickets = 0;
  matchData.innings = 2; matchData.thisOver = []; matchData.history = [];
  updateUI();
}

function updateUI() {
  document.getElementById("score").innerText = matchData.score + "/" + matchData.wickets;
  document.getElementById("overs").innerText = getOvers() + " Overs";
  document.getElementById("thisOver").innerText = matchData.thisOver.join(" ");

  // THE MAGIC LOCK: Sirf wahi update karo jisme cursor na ho
  const setIfUnfocused = (id, val) => {
      const el = document.getElementById(id);
      if (document.activeElement !== el) el.value = val;
  };

  setIfUnfocused("teamA", matchData.teamA);
  setIfUnfocused("teamB", matchData.teamB);
  setIfUnfocused("striker", matchData.striker);
  setIfUnfocused("strikerRuns", matchData.strikerRuns);
  setIfUnfocused("strikerBalls", matchData.strikerBalls);
  setIfUnfocused("nonStriker", matchData.nonStriker);
  setIfUnfocused("nonStrikerRuns", matchData.nonStrikerRuns);
  setIfUnfocused("nonStrikerBalls", matchData.nonStrikerBalls);
  setIfUnfocused("bowler", matchData.bowler);
  setIfUnfocused("bowlerRuns", matchData.bowlerRuns);
  setIfUnfocused("bowlerWickets", matchData.bowlerWickets);
  setIfUnfocused("target", matchData.target);
  
  saveData();
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();

  // AUTO-SAVE LISTENERS (No more clicking "Save Edits")
  const inputIds = ["teamA", "teamB", "striker", "strikerRuns", "strikerBalls", "nonStriker", "nonStrikerRuns", "nonStrikerBalls", "bowler", "bowlerRuns", "bowlerWickets", "target"];
  
  inputIds.forEach(id => {
      document.getElementById(id).addEventListener("input", (e) => {
          let val = e.target.value;
          if(e.target.type === 'number') { val = parseInt(val) || 0; }
          matchData[id] = val;
          saveData(); // Turant LocalStorage mein daal do
      });
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
      if (txt === "RESET FULL MATCH") btn.onclick = () => { if(confirm("Sab zero ho jayega. Pakka?")) { localStorage.removeItem("bplData"); location.reload(); } };
  });

  const uploadLogo = (id, key) => {
      document.getElementById(id).addEventListener("change", function(e) {
          const reader = new FileReader();
          reader.onload = (event) => { matchData[key] = event.target.result; saveData(); };
          if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
      });
  };
  uploadLogo("teamALogo", "teamALogo");
  uploadLogo("teamBLogo", "teamBLogo");
});
