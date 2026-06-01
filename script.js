let matchData = JSON.parse(localStorage.getItem("bplData")) || {
  teamA: "ROYAL WARRIORS",
  teamB: "TIGER STRIKERS",

  score: 0,
  wickets: 0,
  balls: 0,

  totalOvers: 8,
  target: 0,

  innings: 1,

  thisOver: [],
  history: []
};

function saveData() {
  localStorage.setItem("bplData", JSON.stringify(matchData));
}

function getOvers() {
  return Math.floor(matchData.balls / 6) + "." + (matchData.balls % 6);
}

function saveHistory() {

  const snapshot = {
    score: matchData.score,
    wickets: matchData.wickets,
    balls: matchData.balls,
    target: matchData.target,
    innings: matchData.innings,
    thisOver: [...matchData.thisOver]
  };

  matchData.history.push(snapshot);

  // max 20 undo
  if (matchData.history.length > 20) {
    matchData.history.shift();
  }
}
function saveMatchInfo(){

const teamA = document.getElementById("teamA");
const teamB = document.getElementById("teamB");
const striker = document.getElementById("striker");
const nonStriker = document.getElementById("nonStriker");
const bowler = document.getElementById("bowler");

if(teamA){
matchData.teamA = teamA.value;
}

if(teamB){
matchData.teamB = teamB.value;
}

if(striker){
matchData.striker = striker.value;
}

if(nonStriker){
matchData.nonStriker = nonStriker.value;
}

if(bowler){
matchData.bowler = bowler.value;
}

saveData();

}
function updateUI() {

  const scoreBox = document.getElementById("score");
  if (scoreBox) {
    scoreBox.innerText =
      matchData.score + "/" + matchData.wickets;
  }

  const oversBox = document.getElementById("overs");
  if (oversBox) {
    oversBox.innerText = getOvers();
  }

  const thisOverBox = document.getElementById("thisOver");
  if (thisOverBox) {
    thisOverBox.innerText =
      matchData.thisOver.join(" ");
  }

  saveData();
}

function addRun(run) {

  saveHistory();

  matchData.score += run;
  matchData.balls++;

  matchData.thisOver.push(run);

  if (matchData.thisOver.length > 6) {
    matchData.thisOver.shift();
  }

  updateUI();
}

function addWicket() {

  saveHistory();

  matchData.wickets++;
  matchData.balls++;

  matchData.thisOver.push("W");

  if (matchData.thisOver.length > 6) {
    matchData.thisOver.shift();
  }

  if (matchData.wickets >= 8) {
    alert("ALL OUT");
  }

  updateUI();
}

function wideBall() {

  saveHistory();

  matchData.score += 1;

  matchData.thisOver.push("WD");

  if (matchData.thisOver.length > 6) {
    matchData.thisOver.shift();
  }

  updateUI();
}

function noBall() {

  saveHistory();

  matchData.score += 1;

  matchData.thisOver.push("NB");

  if (matchData.thisOver.length > 6) {
    matchData.thisOver.shift();
  }

  updateUI();
}

function undoBall() {

  if (matchData.history.length === 0) {
    return;
  }

  const prev =
    matchData.history.pop();

  matchData.score = prev.score;
  matchData.wickets = prev.wickets;
  matchData.balls = prev.balls;
  matchData.target = prev.target;
  matchData.innings = prev.innings;
  matchData.thisOver = [...prev.thisOver];

  updateUI();
}

function startSecondInnings() {

  matchData.target =
    matchData.score + 1;

  matchData.score = 0;
  matchData.wickets = 0;
  matchData.balls = 0;

  matchData.innings = 2;

  matchData.thisOver = [];
  matchData.history = [];

  updateUI();

  alert(
    "2nd Innings Started\nTarget: " +
    matchData.target
  );
}

function resetMatch() {

  if (!confirm("Reset Match?")) {
    return;
  }

  localStorage.removeItem("bplData");

  matchData = {
    teamA: "ROYAL WARRIORS",
    teamB: "TIGER STRIKERS",

    score: 0,
    wickets: 0,
    balls: 0,

    totalOvers: 8,
    target: 0,

    innings: 1,

    thisOver: [],
    history: []
  };

  updateUI();
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateUI();

    document
      .querySelectorAll(".runBtn")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          () => {

            const txt =
              btn.innerText.trim();

            if (txt === "0") addRun(0);
            if (txt === "1") addRun(1);
            if (txt === "2") addRun(2);
            if (txt === "3") addRun(3);
            if (txt === "4") addRun(4);
            if (txt === "5") addRun(5);

            if (txt === "6=OUT") {
              addWicket();
            }

          }
        );

      });

    document
      .querySelectorAll("button")
      .forEach(btn => {

        const txt =
          btn.innerText.trim();

        if (txt === "WD") {
          btn.onclick = wideBall;
        }

        if (txt === "NB") {
          btn.onclick = noBall;
        }

        if (txt === "UNDO") {
          btn.onclick = undoBall;
        }

        if (
          txt === "START 2ND INNINGS"
        ) {
          btn.onclick =
            startSecondInnings;
        }

        if (
          txt === "RESET MATCH"
        ) {
          btn.onclick =
            resetMatch;
        }
setInterval(
saveMatchInfo,
1000
);
      });

  }
);
