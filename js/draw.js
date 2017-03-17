/**
 * Created by Administrator on 2017/2/4.
 */
//得到颜色字符串
function getColor(r,g,b){
    function getRightColorNum(colorNum){
        if(colorNum < 0)
            colorNum = 0;
        else if(colorNum > 255)
            colorNum = 255;
        return colorNum;
    }
    return "rgb(" + getRightColorNum(r) + "," + getRightColorNum(g) + "," + getRightColorNum(b) + ")";
}

//绘制一个小方块
function drawBlock(ctx,x,y,size,r,g,b){
    ctx.save();
        ctx.translate(x,y);
        ctx.fillStyle = getColor(r-50,g-50,b-50);
        ctx.fillRect(0,0,size,size);
        ctx.fillStyle = getColor(r,g,b);
        ctx.fillRect(3,3,size-6,size-6);
    ctx.restore();
}

//绘制一整个方块
function drawToy(ctx,x,y,size,toyLook,colorIndex){
    var r = colorArr[colorIndex].r;
    var g = colorArr[colorIndex].g;
    var b = colorArr[colorIndex].b;
    for(var i = 0; i < toyLook.length; i ++){
        for(var j = 0; j < toyLook[i].length; j ++){
            if(toyLook[i][j]){
                drawBlock(ctx,x + j*size ,y + i*size ,size,r,g,b);
            }
        }
    }
}

//绘制棋盘
function drawTable(ctx,gameTab,size){
    for(var i = 0; i < gameTab.length; i ++){
        for(var j = 0; j < gameTab[i].length; j ++){
            if(gameTab[i][j] > -1){
                var colorIndex = gameTab[i][j];
                var r = colorArr[colorIndex].r;
                var g = colorArr[colorIndex].g;
                var b = colorArr[colorIndex].b;
                drawBlock(ctx,j*size ,i*size,size,r,g,b);
            }
        }
    }
}

//绘制圈圈
function drawArc(ctx,x,y,ar,w,p,r,g,b){
    ctx.beginPath();
    ctx.arc(x,y,ar, -Math.PI/2, 2*Math.PI*p-Math.PI/2 , false);
    ctx.strokeStyle = getColor(r,g,b);
    ctx.lineWidth = w;
    ctx.stroke();
}

//绘字
function drawText(ctx,x,y,t,font,r,g,b){
    ctx.fillStyle = getColor(r,g,b);
    ctx.font = font;
    ctx.textBaseline = "middle";
    ctx.textAlign="center";
    ctx.fillText(t,x,y);

}