let matchData = JSON.parse(localStorage.getItem("bplData")) || {

teamA:"ROYAL WARRIORS",
teamB:"TIGER STRIKERS",

score:0,
wickets:0,

balls:0,

totalOvers:8,

target:0,

innings:1,

thisOver:[],

history:[]

};

function saveData(){

localStorage.setItem(
"bplData",
JSON.stringify(matchData)
);

}

function getOvers(){

return Math.floor(
matchData.balls/6
)+"."+
(matchData.balls%6);

}

function updateUI(){

const scoreBox =
document.getElementById("score");

if(scoreBox){

scoreBox.innerText=
matchData.score+
"/"+
matchData.wickets;

}

const oversBox =
document.getElementById("overs");

if(oversBox){

oversBox.innerText=
getOvers();

}

const thisOverBox =
document.getElementById("thisOver");

if(thisOverBox){

thisOverBox.innerText=
matchData.thisOver.join(" ");

}

saveData();

}

function saveHistory(){

matchData.history.push(

JSON.stringify(matchData)

);

}

function addRun(run){

saveHistory();

matchData.score += run;

matchData.balls++;

matchData.thisOver.push(run);

if(matchData.thisOver.length>6){

matchData.thisOver.shift();

}

updateUI();

}

function addWicket(){

saveHistory();

matchData.wickets++;

matchData.balls++;

matchData.thisOver.push("W");

if(matchData.thisOver.length>6){

matchData.thisOver.shift();

}

if(matchData.wickets>=8){

alert("ALL OUT");

}

updateUI();

}

function wideBall(){

saveHistory();

matchData.score++;

matchData.thisOver.push("WD");

updateUI();

}

function noBall(){

saveHistory();

matchData.score++;

matchData.thisOver.push("NB");

updateUI();

}

function undoBall(){

if(
matchData.history.length===0
){

return;

}

matchData =
JSON.parse(

matchData.history.pop()

);

updateUI();

}

function startSecondInnings(){

matchData.target =
matchData.score + 1;

matchData.score = 0;

matchData.wickets = 0;

matchData.balls = 0;

matchData.innings = 2;

matchData.thisOver = [];

updateUI();

alert(
"Target = "+
matchData.target
);

}

function resetMatch(){

localStorage.removeItem(
"bplData"
);

location.reload();

}

document.addEventListener(
"DOMContentLoaded",
()=>{

updateUI();

const buttons =
document.querySelectorAll(
".runBtn"
);

buttons.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const txt =
btn.innerText.trim();

if(txt==="0") addRun(0);

if(txt==="1") addRun(1);

if(txt==="2") addRun(2);

if(txt==="3") addRun(3);

if(txt==="4") addRun(4);

if(txt==="5") addRun(5);

if(txt==="6=OUT")
addWicket();

});

});

const allBtns =
document.querySelectorAll(
"button"
);

allBtns.forEach(btn=>{

const txt =
btn.innerText.trim();

if(txt==="WD"){

btn.onclick=
wideBall;

}

if(txt==="NB"){

btn.onclick=
noBall;

}

if(txt==="UNDO"){

btn.onclick=
undoBall;

}

if(
txt==="START 2ND INNINGS"
){

btn.onclick=
startSecondInnings;

}

if(
txt==="RESET MATCH"
){

btn.onclick=
resetMatch;

}

});

});
