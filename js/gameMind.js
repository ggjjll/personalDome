/**
 * Created by Coffee on 2017/2/4.
 */
var shouldShow = true;
var gameCanvas = null;
var gameCanvasWidth = 0;
var gameCanvasHeight = 0;
var gameCtx = null;

var nextCanvas = null;
var nextCanvasWidth = 0;
var nextCanvasHeight = 0;
var nextCtx = null;

var levelCanvas = null;
var levelCtx = null;

var blockSize = 0;
var toyKindIndex = 0;
var toyDirIndex = 0;
var toyLook = null;
var toyX = 0;
var toyY = 0;
var colorIndex = 0;
var nextToyKindIndex = 0;
var nextColorIndex = 0;

var isKO = false;
var isPlay = true;
var score = 0;
var row = 0;

var timer = null;
window.onload = function(){
    //初始化主画布
    gameCanvas = document.getElementById("mainCanvas");
    gameCtx = gameCanvas.getContext("2d");
    gameCanvasWidth = gameCanvas.offsetWidth;
    gameCanvasHeight = gameCanvas.offsetHeight;
    gameCanvas.setAttribute("width",gameCanvasWidth);
    gameCanvas.setAttribute("height",gameCanvasHeight);
    //初始化下一个画布
    nextCanvas = document.getElementById("nextCanvas");
    nextCtx = nextCanvas.getContext("2d");
    nextCanvasWidth = nextCanvas.offsetWidth;
    nextCanvasHeight = nextCanvas.offsetHeight;
    nextCanvas.setAttribute("width",nextCanvasWidth);
    nextCanvas.setAttribute("height",nextCanvasHeight);
    ////初始化等级画布
    levelCanvas = document.getElementById("levelCanvas");
    levelCtx = levelCanvas.getContext("2d");
    levelCanvas.setAttribute("width",nextCanvasWidth);
    levelCanvas.setAttribute("height",nextCanvasHeight);

    addEvent();
    toyLook = toyArr[toyKindIndex][toyDirIndex];
    blockSize = gameCanvasHeight / 20;
 //   playNewGame();

};

function addEvent(){
    document.onkeydown = function(event){
    //    console.log(event.keyCode);
        switch (event.keyCode){
            case 38:
            case 32:{
                //变换角度
                changeToyDirIndex();
                break;
            }
            case 37:{
                //向左移动
                changeToyXy(-1,0);
                break;
            }
            case 39:{
                //向右移动
                changeToyXy(1,0);
                break;
            }
            case 40:{
                //向右移动
                changeToyXy(0,1);
                break;
            }
            case 80:{
                //游戏暂停与继续
                changeIsPlay();
                break;
            }
            case 82:{
                //重新开始新游戏
                playNewGame();
                break;
            }
        }
    };
    document.getElementById("playGame").addEventListener("click",changeIsPlay);
    document.getElementById("reGame").addEventListener("click",playNewGame);
    document.getElementById("startBtn").addEventListener("click",playNewGame);
}

function playNewGame(){
    document.getElementById("startBox").setAttribute("style","display:none");
    nextToyKindIndex = Math.floor(Math.random()*toyArr.length);
    nextColorIndex = Math.floor(Math.random()*colorArr.length);
    addToy();
    isKO = false;
    isPlay = false;
    score = 0;
    row = 0;
    for(var i = 0 ; i < 20; i ++){
        for(var j = 0; j < 12; j ++){
            gameTab[i][j] = -1;
        }
    }
    reDraw();
    reDrawNext();
    reDrawLevel();
    changeInnerHtml("row",row);
    changeInnerHtml("score",score);
    changeIsPlay();
    if(timer!=null)
        clearInterval(timer);
    timer = setInterval(function(){
        if(!isPlay)
            return;
        if(isKO)
            clearInterval(timer);
        changeToyXy(0,1)
    },500)
}

//越界判断
function clouldChange(toyLook,dx,dy){
    for(var i = 0; i < toyLook.length; i ++){
        for(var j = 0; j < toyLook[i].length; j ++){
            if(toyLook[i][j]){
                if(toyX+j+dx < 0 || toyX+j+dx > gameTab[0].length-1)
                    return false;
                if(toyY+i+dy > gameTab.length-1 || (toyY >= 0 && gameTab[toyY+i+dy][toyX+j+dx] > -1))
                    return false;
            }
        }
    }
    return true;
}

//判断是否结束
function isEnd(){
    for(var j = 0; j < toyLook[0].length; j ++){
        for(var i = toyLook.length - 1; i >= 0 ; i --){
            if(toyLook[i][j]){
                if(toyY+i < gameTab.length-1){
                    if(gameTab[toyY+i+1][toyX+j] > -1)
                        return true;
                }
                else
                    return true;
                break;
            }
        }
    }
    return false;
}

//判断是否游戏结束
function isGameOver(){
    for(var i = 0; i < gameTab[0].length; i ++){
        if(gameTab[0][i] > -1)
            return true;
    }
    return false;
}

//判断是否得分
function isGetScore(){
    var score = 0;
    for(var i = gameTab.length - 1; i >= 0; i --){
        var testNum = 0;
        for(var j = 0; j < gameTab[i].length; j ++){
            if(gameTab[i][j] < 0)
                break;
            testNum += gameTab[i][j];
        }
        if(j >= gameTab[i].length){
            score += testNum + 20;
            removeRow(i);
            i ++;
        }
    }
    return score;
}

//消除行
function removeRow(r){
    for(var j = 0; j < gameTab[0].length; j ++){
        for(var i = r; i > 0; i --){
            gameTab[i][j] = gameTab[i-1][j];
        }
        gameTab[0][j] = -1;
    }
    row ++;
    changeInnerHtml("row",row);
}

//改变当前块儿方向
function changeToyDirIndex(){
    if(isKO || !isPlay)
        return;
    var testDir = toyDirIndex+1;
    if(testDir >= toyArr[toyKindIndex].length)
        testDir = 0;
    var testToyLook = toyArr[toyKindIndex][testDir];
    if(clouldChange(testToyLook,0,0)){
        toyDirIndex = testDir;
        toyLook = toyArr[toyKindIndex][toyDirIndex];
        reDraw();
    }
    //    show("toyDirIndex",toyDirIndex);
}

//移动当前块儿
function changeToyXy(dx,dy){
    if(isKO || !isPlay)
        return;
    if(clouldChange(toyLook,dx,dy)){
        toyX += dx;
        toyY += dy;
    }
    if(isEnd()){
        addToTab();
        addToy();
        reDrawNext();
        score += 1;
        changeInnerHtml("score",score);
        reDrawLevel();
    }
    reDraw();
}

//改变游戏状态
function changeIsPlay(){
    isPlay = !isPlay;
    if(isPlay)
        changeInnerHtml("playGame","暂停游戏(P)");
    else
        changeInnerHtml("playGame","继续游戏(P)");
}

//改变显示的文字
function changeInnerHtml(domId,text){
    document.getElementById(domId).innerHTML = text;
}

//添加到棋盘
function addToTab(){
    for(var i = 0; i < toyLook.length; i ++){
        for(var j = 0; j < toyLook[i].length; j ++){
            if(toyLook[i][j] && toyY+i >= 0){
                gameTab[toyY+i][toyX+j] = colorIndex;
            }
        }
    }
    var getScore = isGetScore();
    if(getScore){
        score += getScore;
        changeInnerHtml("score",score);
        reDraw();
        reDrawLevel();
    }
    if(isGameOver()){
        reDraw();
        isKO = true;
        gameCtx.clearRect(0,0,gameCanvasWidth,gameCanvasHeight);
        drawTable(gameCtx,gameOverTab,blockSize);
    }
//    console.log(gameTab);
}

//添加块儿
function addToy(){
    toyKindIndex = nextToyKindIndex;
    toyDirIndex = 0;
    toyLook = toyArr[toyKindIndex][toyDirIndex];
    toyX = Math.floor((12 - toyLook[0].length)/2);
    toyY = - toyLook.length;
    colorIndex = nextColorIndex;
    nextToyKindIndex = Math.floor(Math.random()*toyArr.length);
    nextColorIndex = Math.floor(Math.random()*colorArr.length);
    changeToyXy(0,1);
}

//重绘
function reDraw(){
    if(isKO)
        return;
    gameCtx.clearRect(0,0,gameCanvasWidth,gameCanvasHeight);
    drawTable(gameCtx,gameTab,blockSize);
    drawToy(gameCtx,toyX * blockSize,toyY * blockSize,blockSize,toyLook,colorIndex);
}

//重绘下一个
function reDrawNext() {
    nextCtx.clearRect(0, 0, nextCanvasWidth, nextCanvasHeight);
    var nextToyLook = toyArr[nextToyKindIndex][0];
    var nextToyLookWidth = nextToyLook[0].length * blockSize;
    var nextToyLookHeight = nextToyLook.length * blockSize;
    var startX = (nextCanvasWidth - nextToyLookWidth)/2;
    var startY = (nextCanvasHeight - nextToyLookHeight)/2;
    drawToy(nextCtx,startX,startY,blockSize,nextToyLook,nextColorIndex);
}

//重绘等级
function reDrawLevel() {
    levelCtx.clearRect(0, 0, nextCanvasWidth, nextCanvasHeight);
    var startX = nextCanvasWidth / 2;
    var startY = nextCanvasHeight / 2;
    var l = parseInt(score / 500) + 1;
    var p = (score % 500)/500;
    drawArc(levelCtx,startX,startY,startY-18,4,1,220,220,220);
    drawArc(levelCtx,startX,startY,startY-18,6,p,230,100,30);
    drawText(levelCtx,startX,startY,l,(startY-18) + "px sans-serif",220,220,220);
}

function show(title,something){
    if(!shouldShow)
        return;
    console.log(title + ":");
    console.log(something);
}