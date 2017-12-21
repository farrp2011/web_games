/* 
 * Copyright (C) 2017 Paul Farr
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 * 
 * Paul Farr would really like a well paying job as well. Email: farrp2011@live.com
 */


const HTML_HOOK = "snake_game";
const CANVAS_ID = "canvas_id_50";

const ARROW_UP = 38;
const ARROW_DOWN = 40;
const ARROW_RIGHT = 39;
const ARROW_LEFT = 37;

const GAME_SPEED = 300;// quater second
const BOX_SIZE = 25;

const BACKGROUND_COLOR = "#0acf00";//green
const PLAYER_COLOR = "#009b95";//Blue
const LINE_COLOR = "#000000";//black
const FOOD_COLOR = "#fd0006";//red
const HUB_COLOR = "#ff7100";//orange

const PLAY_AREA = 500;//this is got to both withd and hieght
const HUB_AREA = 50;//this is tacked on to the bottom of the screen

const WIDTH = PLAY_AREA;
const HEIGHT = PLAY_AREA + HUB_AREA;


var gameObj;

function createGameObj()
{
    var gameObj =
        {
            direction: null,//when it is not null the game will start
            score: 0,
            body:[{x:9,y:9}],
            timeObj:null,
            addToBody: true,
            food:{x:0,y:0}
        };

    return gameObj;
}

function setUp()
{
    var hookEle = document.getElementById(HTML_HOOK);
    hookEle.innerHTML = `
            <canvas id="`+CANVAS_ID+`" width="`+WIDTH+`" height="`
           +HEIGHT+`"> </canvas><br/>`;
    gameObj = createGameObj();
    
    gameObj.timeObj = setInterval(mainLoop, GAME_SPEED);
    spawnFood();//need to make some random food
    display();
    var c = document.getElementById(CANVAS_ID);
    var ctx = c.getContext("2d");
    ctx.fillStyle = "white";
    ctx.font = "30px Comic Sans MS";
    var txt = "Use Arrow Keys\nTo Start";

    ctx.fillText(txt,c.width/2 - Math.round(ctx.measureText(txt).width/2), c.height/2);
}



function display()
{
    if(gameObj.timeObj === null)//if the time obj is not working don't play the game
    {
        return ;
    }
    
    var c = document.getElementById(CANVAS_ID);
    var ctx = c.getContext("2d");
    
    //background
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0,0,PLAY_AREA,PLAY_AREA);
    
    //Hub
    ctx.fillStyle = HUB_COLOR;
    ctx.fillRect(0,PLAY_AREA,PLAY_AREA,HUB_AREA);
    
    //fake food
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(gameObj.food.x*BOX_SIZE,gameObj.food.y*BOX_SIZE,BOX_SIZE,BOX_SIZE);
    
    //draw player
    //draw the head first
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(gameObj.body[0].x*BOX_SIZE,gameObj.body[0].y*BOX_SIZE,BOX_SIZE,BOX_SIZE);
    
    var eyeCenX = 0;
    var eyeCenY = 0;
    var pupilCenX = 0;
    var pupilCenY = 0;
    
    //then we draw the eye
    //Make Eye... eye will show the dirction of the snake
    switch(gameObj.direction)
    {
        case ARROW_UP:
            //console.log("Going Up");
            eyeCenX = gameObj.body[0].x *BOX_SIZE + (BOX_SIZE/2);
            eyeCenY = gameObj.body[0].y *BOX_SIZE + (BOX_SIZE/4);
            pupilCenX = gameObj.body[0].x *BOX_SIZE + (BOX_SIZE/2);
            pupilCenY = gameObj.body[0].y *BOX_SIZE + (BOX_SIZE/8);
            break;
        case ARROW_DOWN:
            //console.log("Going Down");
            eyeCenX = gameObj.body[0].x *BOX_SIZE + (BOX_SIZE/2);
            eyeCenY = gameObj.body[0].y *BOX_SIZE + (BOX_SIZE * .75);
            pupilCenX = gameObj.body[0].x *BOX_SIZE + (BOX_SIZE/2);
            pupilCenY = gameObj.body[0].y *BOX_SIZE + (BOX_SIZE * .875);
            break;
        case ARROW_LEFT:
            //console.log("Going Left");
            eyeCenX = gameObj.body[0].x *BOX_SIZE + (BOX_SIZE/4);
            eyeCenY = gameObj.body[0].y *BOX_SIZE + (BOX_SIZE/2);
            pupilCenX = gameObj.body[0].x *BOX_SIZE + (BOX_SIZE/8);
            pupilCenY = gameObj.body[0].y *BOX_SIZE + (BOX_SIZE/2);
            break;
        case ARROW_RIGHT:
            //console.log("Going Right");
            eyeCenX = gameObj.body[0].x *BOX_SIZE + (BOX_SIZE * .75);
            eyeCenY = gameObj.body[0].y *BOX_SIZE + (BOX_SIZE/2);
            pupilCenX = gameObj.body[0].x *BOX_SIZE + (BOX_SIZE * .875);
            pupilCenY = gameObj.body[0].y *BOX_SIZE + (BOX_SIZE/2);
            break;
        case null:
            //console.log("waiting for game to start");
            eyeCenX = gameObj.body[0].x *BOX_SIZE + (BOX_SIZE/2);
            eyeCenY = gameObj.body[0].y *BOX_SIZE + (BOX_SIZE/2);
            pupilCenX = gameObj.body[0].x *BOX_SIZE + (BOX_SIZE/2);
            pupilCenY = gameObj.body[0].y *BOX_SIZE + (BOX_SIZE/2);
            break;      
    }
    //Now we know where the center is we can paint
    //white of the eye
    ctx.beginPath();
    ctx.arc(eyeCenX,eyeCenY,(BOX_SIZE/4),0,2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    
    //pupil Time
    ctx.beginPath();
    ctx.arc(pupilCenX,pupilCenY,(BOX_SIZE/8),0,2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    //finly we draw the rest of the body
    ctx.fillStyle = PLAYER_COLOR;
    for(var i = 1; i < gameObj.body.length ; i++)
    {
        ctx.fillRect(gameObj.body[i].x*BOX_SIZE,gameObj.body[i].y*BOX_SIZE,BOX_SIZE,BOX_SIZE);
    }
    
    //draw the gridlines
    for(var i = 0 ; i*BOX_SIZE < PLAY_AREA+1 ; i++)
    {
        //Vertical Lines
        ctx.moveTo(i*BOX_SIZE,0);
        ctx.lineTo(i*BOX_SIZE,PLAY_AREA);
        ctx.stroke(); 
        
        //Horizontal Lines
        ctx.moveTo(0,i*BOX_SIZE);
        ctx.lineTo(PLAY_AREA,i*BOX_SIZE);
        ctx.stroke();
    }
    
    //display score
    
    ctx.fillStyle = "white";
    ctx.font = "30px Comic Sans MS";
    var txt = "Game Over";

    ctx.fillText("Score: "+gameObj.score,c.width/2 - Math.round(ctx.measureText(txt).width/2), PLAY_AREA+30);

    
}

function mainLoop()
{
    if(gameObj.direction === null)//if the player has not sected a dirction don't do anything
    {
        return ;
    }
    //console.log("we are now playing");
    
    var newBodyPart = null;
    
    if(gameObj.addToBody === true)//we need to add to the snake
    {
        gameObj.addToBody = false;
        //we start by making a new body part
        //then we add it after everthing has moved
        
        newBodyPart = {x:gameObj.body[gameObj.body.length-1].x,y:gameObj.body[gameObj.body.length-1].y}
    }
    
    
    
    
    
    for(var i = gameObj.body.length -1 ; i > 0 ; i--)
    {//move the rest of the body by copying what happed in front of it
        
        //console.log("index:"+i+" is being moved");
        gameObj.body[i].x = gameObj.body[i-1].x;
        gameObj.body[i].y = gameObj.body[i-1].y;
    }
    
    if(newBodyPart !== null)//if newBodypart is not null we need to add it
    {
        gameObj.body.push(newBodyPart);
    }
    
    
    switch (gameObj.direction)//move the head
    {
        case ARROW_UP:
            gameObj.body[0].y--;
            break;
        case ARROW_DOWN:
            gameObj.body[0].y++;
            break;
        case ARROW_LEFT:
            gameObj.body[0].x--;
            break;
        case ARROW_RIGHT:
            gameObj.body[0].x++;
            break;
    }
    
    
    if(gameObj.body[0].x === gameObj.food.x && gameObj.body[0].y === gameObj.food.y)
    {
        //console.log("Yum!!!");
        gameObj.score++;//your winning!!!!!
        spawnFood();//We need some new food
        gameObj.addToBody = true;
    }
    
    var lost = false;
    
    
    
    //did we lose????
    if(gameObj.body[0].x < 0 ||
            gameObj.body[0].y < 0 ||
            gameObj.body[0].y > PLAY_AREA/BOX_SIZE -1 ||
            gameObj.body[0].x > PLAY_AREA/BOX_SIZE -1)
    {
        //console.log("you lose");
        lost = true;
    }
    
    for(var i = 1/*don't care about the head*/; i < gameObj.body.length ; i++)
    {
        if(gameObj.body[0].x === gameObj.body[i].x &&
                gameObj.body[0].y === gameObj.body[i].y)
        {
            //console.log("you lose");
            lost = true;
        }
    }
    
    if(lost === true)
    {
        clearInterval(gameObj.timeObj);//stop the loop
        gameObj.timeObj = null;
        //display the Game Over
        var c = document.getElementById(CANVAS_ID);
        var ctx = c.getContext("2d");
        ctx.fillStyle = "white";
        ctx.font = "70px Comic Sans MS";
        var txt = "Game Over";
        
        ctx.fillText("Game Over",c.width/2 - Math.round(ctx.measureText(txt).width/2), c.height/2);
    }
    else
    {//else everything is fine
        display();
    }
    
    
    
}
function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function spawnFood()
{
    var newX;
    var newY;
    
    var goodPoint = false;
    
    while(goodPoint === false)
    {
        goodPoint = true;
        newX = randomInt(0,PLAY_AREA/BOX_SIZE-1);
        newY = randomInt(0,PLAY_AREA/BOX_SIZE-1); 
        for(var i = 0 ; i < gameObj.body.length ; i++ )
        {
            if(newX === gameObj.body[i].x && newY === gameObj.body[i].y)
            {//if we can get all the way through this we are golden
                goodPoint = false;
                break;
            }
        }
    }
    
    gameObj.food.x = newX;
    gameObj.food.y = newY;
}

//this function reads what keys where pressed
document.onkeydown = function(e) {
    switch (e.keyCode) 
    {
        case ARROW_UP:
            //console.log("up pressed")
            gameObj.direction = ARROW_UP;
            break;
        case ARROW_DOWN:
            gameObj.direction = ARROW_DOWN;
            break;
        case ARROW_LEFT:
            gameObj.direction = ARROW_LEFT;
            break;
        case ARROW_RIGHT:
            gameObj.direction = ARROW_RIGHT;
            break;
    }
    display();
};

setUp();


//game starting time

