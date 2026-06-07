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
  history: [],

striker: "",
nonStriker: "",
bowler: "",

strikerRuns: 0,
strikerBalls: 0,

nonStrikerRuns: 0,
nonStrikerBalls: 0
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
  const strikerRuns = document.getElementById("strikerRuns");
const strikerBalls = document.getElementById("strikerBalls");

const nonStrikerRuns = document.getElementById("nonStrikerRuns");
const nonStrikerBalls = document.getElementById("nonStrikerBalls");

const bowlerRuns = document.getElementById("bowlerRuns");
const bowlerWickets = document.getElementById("bowlerWickets");
  const target = document.getElementById("target");

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

if(bowlerRuns){
matchData.bowlerRuns = bowlerRuns.value;
}

if(bowlerWickets){
matchData.bowlerWickets = bowlerWickets.value;
}
  
if(target){
matchData.target = parseInt(target.value) || 0;
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
const strikerBox = document.getElementById("striker");
if(strikerBox && matchData.striker){
strikerBox.value = matchData.striker;
}

const nonStrikerBox = document.getElementById("nonStriker");
if(nonStrikerBox && matchData.nonStriker){
nonStrikerBox.value = matchData.nonStriker;
}

const bowlerBox = document.getElementById("bowler");
if(bowlerBox && matchData.bowler){
bowlerBox.value = matchData.bowler;
}

const targetBox = document.getElementById("target");
if(targetBox){
targetBox.value = matchData.target || 0;
}
  const strikerRunsBox = document.getElementById("strikerRuns");
if(strikerRunsBox){
strikerRunsBox.value = matchData.strikerRuns || 0;
}

const strikerBallsBox = document.getElementById("strikerBalls");
if(strikerBallsBox){
strikerBallsBox.value = matchData.strikerBalls || 0;
}

const nonStrikerRunsBox = document.getElementById("nonStrikerRuns");
if(nonStrikerRunsBox){
nonStrikerRunsBox.value = matchData.nonStrikerRuns || 0;
}

const nonStrikerBallsBox = document.getElementById("nonStrikerBalls");
if(nonStrikerBallsBox){
nonStrikerBallsBox.value = matchData.nonStrikerBalls || 0;
}

const bowlerRunsBox = document.getElementById("bowlerRuns");
if(bowlerRunsBox){
bowlerRunsBox.value = matchData.bowlerRuns || 0;
}

const bowlerWicketsBox = document.getElementById("bowlerWickets");
if(bowlerWicketsBox){
bowlerWicketsBox.value = matchData.bowlerWickets || 0;
}
  saveData();
}

function addRun(run) {

  saveHistory();

  matchData.score += run;
  
 matchData.strikerRuns =
Number(matchData.strikerRuns || 0) + Number(run);
matchData.strikerBalls += 1;

  matchData.strikerRuns =
Number(matchData.strikerRuns || 0) + Number(run);

matchData.strikerBalls += 1;

if(run % 2 !== 0){

let tempName = matchData.striker;
matchData.striker = matchData.nonStriker;
matchData.nonStriker = tempName;

let tempRuns = matchData.strikerRuns;
matchData.strikerRuns = matchData.nonStrikerRuns;
matchData.nonStrikerRuns = tempRuns;

let tempBalls = matchData.strikerBalls;
matchData.strikerBalls = matchData.nonStrikerBalls;
matchData.nonStrikerBalls = tempBalls;

}

matchData.balls++;
  
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
  matchData.strikerBalls += 1;
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
  matchData.strikerRuns += 1;

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

      });
setInterval(
saveMatchInfo,
1000
);
  }
);
