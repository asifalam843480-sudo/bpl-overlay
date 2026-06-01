// TEAM NAMES

const team1Name = document.getElementById("team1Name");
const team2Name = document.getElementById("team2Name");

// SCORE

const totalScore = document.getElementById("totalScore");
const scoreLarge = document.getElementById("scoreLarge");

const overs = document.getElementById("overs");
const oversLarge = document.getElementById("oversLarge");

// BATSMAN

const batsman1 = document.getElementById("batsman1");
const batsman1Score = document.getElementById("batsman1Score");

const batsman2 = document.getElementById("batsman2");
const batsman2Score = document.getElementById("batsman2Score");

// NEED

const needRuns = document.getElementById("needRuns");
const needBalls = document.getElementById("needBalls");

// BOWLER

const bowlerName = document.getElementById("bowlerName");
const bowlerFigures = document.getElementById("bowlerFigures");

function updateOverlay(){

const t1 =
localStorage.getItem("team1Name");

const t2 =
localStorage.getItem("team2Name");

const score =
localStorage.getItem("score");

const oversData =
localStorage.getItem("overs");

const nr =
localStorage.getItem("needRuns");

const nb =
localStorage.getItem("needBalls");

const bat1 =
localStorage.getItem("bat1");

const bat1s =
localStorage.getItem("bat1Score");

const bat2 =
localStorage.getItem("bat2");

const bat2s =
localStorage.getItem("bat2Score");

const bowler =
localStorage.getItem("bowler");

const figures =
localStorage.getItem("bowlerFigures");

if(t1) team1Name.innerText = t1;

if(t2) team2Name.innerText = t2;

if(score){

totalScore.innerText = score;

scoreLarge.innerText = score;

}

if(oversData){

overs.innerText =
oversData + " OVERS";

oversLarge.innerText =
oversData + " OVERS";

}

if(nr){

needRuns.innerText = nr;

}

if(nb){

needBalls.innerText =
"RUNS IN " + nb + " BALLS";

}

if(bat1){

batsman1.innerText = bat1;

}

if(bat1s){

batsman1Score.innerText =
bat1s;

}

if(bat2){

batsman2.innerText = bat2;

}

if(bat2s){

batsman2Score.innerText =
bat2s;

}

if(bowler){

bowlerName.innerText =
bowler;

}

if(figures){

bowlerFigures.innerText =
figures;

}

}

updateOverlay();

setInterval(updateOverlay,1000);
