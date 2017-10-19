var xLoc = 225;
var yLoc = 50;
var padding = 10;
var size = 70;
var dist = padding + size;
var rad = 10;

var timer = 0;

var cnvs = document.getElementById("c");
var ctx = cnvs.getContext('2d');

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

function start(){
  cnvs.width = 1000;
  cnvs.height = 750;
  checkCookie();
  restart();
  setup();
  randomCoin();


  setInterval(update, 10);

  window.addEventListener('keydown', function (e) {
      if(e.keyCode == 37 && playGame){left();} //left
      else if(e.keyCode == 38 && playGame){up();} //up
      else if(e.keyCode == 39 && playGame){right();} //right
      else if(e.keyCode == 40 && playGame){down();} //down
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
      ctx.fillStyle = "rgb(33, 70, 94)";
      ctx.fillRect(xLoc + dist * i, yLoc + dist * j, size, size);
      tiles[i][j] = new tile(i,j);
    }
  }

  for(var i = 0; i < 60; i++){
    ctx.fillStyle = "rgb(173, 216, 237)";
    ctx.fillRect(tiles[block[i][0]][block[i][1]].locX, tiles[block[i][0]][block[i][1]].locY, size, size);
    tiles[block[i][0]][block[i][1]].avail = false;
  }

  ctx.fillStyle = "rgb(36, 226, 157)";
  ctx.fillRect(mainX, mainY, size-20, size-20);

  ctx.font = "30px Open Sans";
  ctx.fillStyle = "#242424";
  ctx.fillText(points,30,50);

  ctx.font = "30px Open Sans";
  ctx.fillStyle = "#242424";
  ctx.fillText(highScore,30,80);

  if(moveCoin){
    randomCoin();
  }
  else{
    drawCircle(ctx, rad, tiles[coinX][coinY].locX + size/2, tiles[coinX][coinY].locY + size/2, "rgb(212, 155, 30)");
  }

  if(!playGame){
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0,0,cnvs.width, cnvs.height);

    ctx.font = "50px Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER",cnvs.width/2-143,cnvs.height/2);

    ctx.font = "30px Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText("PRESS SPACE TO PLAY AGAIN",cnvs.width/2-203,cnvs.height/2+45);
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
  mainX= 475;
  mainY= 350;
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

function up(){
  mainY -= dist;
  mainIDY -= 1;
}
function down(){
  mainY += dist;
  mainIDY += 1;
}
function right(){
  mainX += dist;
  mainIDX += 1;
}
function left(){
  mainX -= dist;
  mainIDX -= 1;
}
