let matchData = JSON.parse(localStorage.getItem("bplData")) || {
  teamA: "ROYAL WARRIORS", teamB: "TIGER STRIKERS",
  teamALogo: "", teamBLogo: "",
  score: 0, wickets: 0, balls: 0, target: 0, innings: 1,
  thisOver: [], history: [],
  striker: "Player 1", nonStriker: "Player 2", bowler: "Bowler",
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
  if (matchData.history.length > 20) matchData.history.shift();
}

function rotateStrike() {
  let tName = matchData.striker; matchData.striker = matchData.nonStriker; matchData.nonStriker = tName;
  let tRuns = matchData.strikerRuns; matchData.strikerRuns = matchData.nonStrikerRuns; matchData.nonStrikerRuns = tRuns;
  let tBalls = matchData.strikerBalls; matchData.strikerBalls = matchData.nonStrikerBalls; matchData.nonStrikerBalls = tBalls;
}

function checkOverComplete() {
  if (matchData.balls > 0 && matchData.balls % 6 === 0) {
      matchData.thisOver = [];
      rotateStrike();
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

  if (run % 2 !== 0) rotateStrike();
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

  document.getElementById("teamA").value = matchData.teamA;
  document.getElementById("teamB").value = matchData.teamB;
  document.getElementById("striker").value = matchData.striker;
  document.getElementById("strikerRuns").value = matchData.strikerRuns;
  document.getElementById("strikerBalls").value = matchData.strikerBalls;
  document.getElementById("nonStriker").value = matchData.nonStriker;
  document.getElementById("nonStrikerRuns").value = matchData.nonStrikerRuns;
  document.getElementById("nonStrikerBalls").value = matchData.nonStrikerBalls;
  document.getElementById("bowler").value = matchData.bowler;
  document.getElementById("bowlerRuns").value = matchData.bowlerRuns;
  document.getElementById("bowlerWickets").value = matchData.bowlerWickets;
  document.getElementById("target").value = matchData.target;
  
  saveData();
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();

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
      if (txt === "UNDO") btn.onclick = undoBall;
      if (txt === "START 2ND INNINGS") btn.onclick = startSecondInnings;
      if (txt === "RESET MATCH") btn.onclick = () => { if(confirm("Sab delete ho jayega. Pakka?")) { localStorage.removeItem("bplData"); location.reload(); } };
  });

  document.getElementById("saveManualBtn").addEventListener("click", () => {
      matchData.teamA = document.getElementById("teamA").value;
      matchData.teamB = document.getElementById("teamB").value;
      matchData.striker = document.getElementById("striker").value;
      matchData.strikerRuns = parseInt(document.getElementById("strikerRuns").value) || 0;
      matchData.strikerBalls = parseInt(document.getElementById("strikerBalls").value) || 0;
      matchData.nonStriker = document.getElementById("nonStriker").value;
      matchData.nonStrikerRuns = parseInt(document.getElementById("nonStrikerRuns").value) || 0;
      matchData.nonStrikerBalls = parseInt(document.getElementById("nonStrikerBalls").value) || 0;
      matchData.bowler = document.getElementById("bowler").value;
      matchData.bowlerRuns = parseInt(document.getElementById("bowlerRuns").value) || 0;
      matchData.bowlerWickets = parseInt(document.getElementById("bowlerWickets").value) || 0;
      matchData.target = parseInt(document.getElementById("target").value) || 0;
      updateUI();
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
