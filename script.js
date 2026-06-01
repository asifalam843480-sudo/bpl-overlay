let matchData = JSON.parse(localStorage.getItem("bplData")) || {
score: 0,
wickets: 0,
balls: 0,
overs: 8,
target: 0,
innings: 1,
thisOver: [],
history: []
};

function saveData(){
localStorage.setItem("bplData",JSON.stringify(matchData));
}

function getOvers(){
return Math.floor(matchData.balls/6)+"."+(matchData.balls%6);
}

function addBall(run){

matchData.history.push(
JSON.stringify(matchData)
);

if(run==="W"){
matchData.wickets++;
matchData.balls++;
matchData.thisOver.push("W");
}
else{
matchData.score+=run;
matchData.balls++;
matchData.thisOver.push(run);
}

if(matchData.thisOver.length>6){
matchData.thisOver.shift();
}

saveData();
updateScreen();

}

function wideBall(){
matchData.history.push(
JSON.stringify(matchData)
);

matchData.score+=1;
matchData.thisOver.push("WD");

saveData();
updateScreen();
}

function noBall(){
matchData.history.push(
JSON.stringify(matchData)
);

matchData.score+=1;
matchData.thisOver.push("NB");

saveData();
updateScreen();
}

function undoBall(){

if(matchData.history.length===0)
return;

matchData =
JSON.parse(
matchData.history.pop()
);

saveData();
updateScreen();
}

function startSecondInnings(){

matchData.target=
matchData.score+1;

matchData.score=0;
matchData.wickets=0;
matchData.balls=0;
matchData.innings=2;
matchData.thisOver=[];

saveData();
updateScreen();

}

function updateScreen(){

const scoreBox=
document.getElementById("score");

if(scoreBox)
scoreBox.innerText=
matchData.score+"/"+matchData.wickets;

const oversBox=
document.getElementById("overs");

if(oversBox)
oversBox.innerText=
getOvers();

const targetBox=
document.getElementById("target");

if(targetBox)
targetBox.innerText=
matchData.target;

const overBox=
document.getElementById("thisOver");

if(overBox)
overBox.innerText=
matchData.thisOver.join(" ");

}

document.addEventListener(
"DOMContentLoaded",
updateScreen
);
