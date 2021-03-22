var xLoc = 0;
var yLoc = 0;
var padding = 0;
var size = 70;
var dist = padding + size;
var rad = 10;

var timer = 0;

var cnvs = document.getElementById("c");
var ctx = cnvs.getContext('2d');

var cnvsInfo = document.getElementById("info-c");
var ctxInfo = cnvsInfo.getContext('2d');

var tiles = [[],[],[],[],[],[],[],[],[]];
var block = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],
             [0,1],[1,1],[2,1],[3,1],      [5,1],[6,1],[7,1],[8,1],
             [0,2],[1,2],[2,2],                  [6,2],[7,2],[8,2],
             [0,3],[1,3],      [3,3],      [5,3],      [7,3],[8,3],
             [0,4],                                          [8,4],
             [0,5],[1,5],      [3,5],      [5,5],      [7,5],[8,5],
             [0,6],[1,6],[2,6],                  [6,6],[7,6],[8,6],
             [0,7],[1,7],[2,7],[3,7],      [5,7],[6,7],[7,7],[8,7],
             [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8]]
var mainX;
var mainY;
var coinX = 4;
var coinY = 4;
var mainIDX;
var mainIDY;
var points = 0;
var highScore;
var pointsPlus = 10;
var coinCount = 0;

var playGame = true;
var moveCoin = false;

var mapImg = new Image();
mapImg.src = 'img/map.png';

var charImg = new Image();
charImg.src = 'img/character.png';

var appleImg = new Image();
appleImg.src = 'img/apple.png';

var orangeImg = new Image();
orangeImg.src = 'img/orange.png';

var bananaImg = new Image();
bananaImg.src = 'img/banana.png';

var scoreImg = new Image();
scoreImg.src = 'img/scoreboard.png';

var eatcounter = 0;

function start(){
  cnvs.width = 630;
  cnvs.height = 630;

  cnvsInfo.width = 250;
  cnvsInfo.height = 250;
  checkCookie();
  restart();
  setup();
  randomCoin();


  setInterval(update, 10);

  window.addEventListener('keydown', function (e) {
      var walkvalue = e.shiftKey ? 2 : 1;
      if(e.keyCode == 37 && playGame){left(walkvalue);} //left
      else if(e.keyCode == 38 && playGame){up(walkvalue);} //up
      else if(e.keyCode == 39 && playGame){right(walkvalue);} //right
      else if(e.keyCode == 40 && playGame){down(walkvalue);} //down
      else if(e.keyCode == 32 && !playGame){restart(); randomCoin();}

      if(tiles[mainIDX][mainIDY].avail == false){gameOver();}
      if(mainIDX == coinX && mainIDY == coinY){
        moveCoin = true;
        points += rad;
        coinCount++;
        rad = 10;
        if(points > highScore){highScore = points;}
        if(coinCount % 10 == 0){
          pointsPlus++;
        }
      }
  })
}

function setup(){
  timer++;

  for(var i = 0; i < 9; i++){
    for(var j = 0; j < 9; j++){
      tiles[i][j] = new tile(i,j);
    }
  }

  for(var i = 0; i < 60; i++){
    tiles[block[i][0]][block[i][1]].avail = false;
  }

  ctx.drawImage(mapImg, xLoc, yLoc);
  ctx.drawImage(charImg, mainX-35, mainY-50);

  ctxInfo.drawImage(scoreImg, 0, 0, 250, 250);
  ctxInfo.font = "30px mono45-headline";
  ctxInfo.strokeStyle = '#31241f';
  ctxInfo.lineWidth = 8;
  ctxInfo.strokeText(points, 30, 100);
  ctxInfo.strokeText(highScore, 30, 200);
  ctxInfo.fillStyle = "#ffffff";
  ctxInfo.fillText(points,30,100);
  ctxInfo.fillText(highScore,30,200);

  if(moveCoin){
    randomCoin();
    eatcounter = eatcounter === 2 ? 0 : eatcounter+1;
  }
  else{
    // drawCircle(ctx, rad, tiles[coinX][coinY].locX + size/2, tiles[coinX][coinY].locY + size/2, "rgb(212, 155, 30)");
    ctx.globalAlpha = rad/10;
    if(eatcounter === 0)
      ctx.drawImage(appleImg, tiles[coinX][coinY].locX + 17, tiles[coinX][coinY].locY + 12);
    else if(eatcounter === 1)
      ctx.drawImage(bananaImg, tiles[coinX][coinY].locX + 17, tiles[coinX][coinY].locY + 12);
    else
      ctx.drawImage(orangeImg, tiles[coinX][coinY].locX + 17, tiles[coinX][coinY].locY + 12);
    ctx.globalAlpha = 1;
  }

  if(!playGame){
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0,0,cnvs.width, cnvs.height);

    ctx.font = "500 50px mono45-headline";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 8;
    ctx.strokeText("GAME OVER",cnvs.width/2-100,cnvs.height/2);
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER",cnvs.width/2-100,cnvs.height/2);

    ctx.font = "300 30px mono45-headline";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 8;
    ctx.strokeText("PRESS SPACE TO PLAY AGAIN",cnvs.width/2-165,cnvs.height/2+35);
    ctx.fillStyle = "white";
    ctx.fillText("PRESS SPACE TO PLAY AGAIN",cnvs.width/2-165,cnvs.height/2+35);
  }
  if(timer % 20 == 0){
    if(playGame){rad--;}
    if(rad == 0){gameOver();}
  }
}

function tile(a, b){
  this.x = a;
  this.y = b;
  this.locX = xLoc + dist * a;
  this.locY = yLoc + dist * b;
  this.avail = true;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    highScore = getCookie("hscore");
    if (highScore != "") {
      highScore = getCookie("hscore", 0, 365);
    } else {
      highScore = 0;
      setCookie("hscore", 0, 365);
    }
}

function update(){
  ctx.clearRect(0, 0, cnvs.width, cnvs.height);
  setup();
}

function restart(){
  mainX= 315;
  mainY= 315;
  xLoc = (cnvs.width - size * 9 - padding * 8)/2;
  yLoc = (cnvs.height - size * 9 - padding * 8)/2;
  mainIDX = 4;
  mainIDY = 4;
  playGame = true;
  points = 0;
  pointsPlus = 10;
  coinCount = 0;
  rad = 10;
  timer = 0;
}

function gameOver(){
  playGame = false;
  if(points > highScore){highScore = points;}
  setCookie("hscore", highScore, 365);
}


function drawCircle(context, radius, centX, centY, color){
  context.beginPath();
  context.arc(centX, centY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
}

function randomCoin(){
  while(true){
    var randX = Math.floor((Math.random() * 8));
    var randY = Math.floor((Math.random() * 8));
    if(tiles[randX][randY].avail){
      if(randX != coinX || randY != coinY){
        if(randX != mainIDX || randY != mainIDY){
          drawCircle(ctx, 10, tiles[randX][randY].locX + size/2, tiles[randX][randY].locY + size/2, "rgb(212, 155, 30)");
          coinX = randX;
          coinY = randY;
          break;
        }
      }
    }
  }
  moveCoin = false;
}

function up(walkvalue){
  mainY -= dist * walkvalue;
  if(mainIDY - walkvalue < 0) gameOver();
  mainIDY -= walkvalue;
}
function down(walkvalue){
  mainY += dist * walkvalue;
  if(mainIDY + walkvalue > 8) gameOver();
  mainIDY += walkvalue;
}
function right(walkvalue){
  mainX += dist * walkvalue;
  if(mainIDX + walkvalue > 8) gameOver();
  mainIDX += walkvalue;
}
function left(walkvalue){
  mainX -= dist * walkvalue;
  if(mainIDX - walkvalue < 0) gameOver();
  mainIDX -= walkvalue;
}
