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
const HTML_HOOK = "canyon_race";
const CANVAS_ID = "canyon_race_something_something_50";
const START_ID = "this_is_a_button_thing_50";
const IMG_ID = "this_is_a_img_thing_50";
const IMG_ID_CRASH = "this_is_a_img_thing_that_crashed_50";

const HEIGHT = 600;
const WIDTH = 800;

const STARTING_CLEARANCE = 250;
const MIN_CLEARANCE = 5;
const SEG_HEIGHT = 20;
const OFFSET = 10;//how much the walls will move per set

//const 

const STARTING_SPEED = 200;
const INCREMENT_SPEED = 30;

const WALL_COLOR = "#873a00";//brownish
const FLOOR_COLOR = "#b5b519";//Yellowish

setUp();//creates the canvas
//Oh no globa varable
var timeObj;//I needed access to this so I can stop the timer

var gameObj = CreateGameObj();
console.log(timeObj);
function setUp()
{
    var hookEle = document.getElementById(HTML_HOOK);
    hookEle.innerHTML = `<img id="`+IMG_ID+`" hidden src="./car.png"><img id="`+IMG_ID_CRASH+`" hidden src="./car_crash.png">
            <canvas id="`+CANVAS_ID+`" width="`+WIDTH+`" height="`
           +HEIGHT+`"> </canvas><br/>
        <button id=`+START_ID+` onclick="kickOff();">Start Game</button> `;
}

function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function CreateGameObj()
{
    var gameObj =
    {
        clearance: STARTING_CLEARANCE,
        car_location: WIDTH/2,
        car_img: document.getElementById(IMG_ID),
        score: 0,
        canvas: document.getElementById(CANVAS_ID),
        wallArr:[{wall:randomInt(10, WIDTH-STARTING_CLEARANCE), clearance: STARTING_CLEARANCE}],
        canyonLoc: WIDTH/2,
        speed: STARTING_SPEED,
        countDown: INCREMENT_SPEED
    };
    
    
    
    return gameObj; 
}

function kickOff()
{
     timeObj = setInterval(mainLoop , STARTING_SPEED);
     document.getElementById(START_ID).style.visibility = "hidden";
}



function display(e)
{
    var c = document.getElementById(CANVAS_ID);
    var ctx = c.getContext("2d");
    
    
    //console.log("display ran");
    
    //background color or the floor
    ctx.fillStyle = FLOOR_COLOR;
    ctx.fillRect(0,0,c.width,c.height);
    
    ctx.fillStyle = WALL_COLOR;
    for(var i = 0 ; i < gameObj.wallArr.length ; i++)//we need to go backward
    {
        
        ctx.fillRect(0,i*SEG_HEIGHT , gameObj.wallArr[i].wall, SEG_HEIGHT);//leftwall
        /*ctx.beginPath();
        ctx.moveTo(0, i*SEG_HEIGHT);//upper left
        ctx.lineTo(gameObj.wallArr[i].wall,i*SEG_HEIGHT);//upper right
        ctx.lineTo(gameObj.wallArr[i].wall,SEG_HEIGHT);//lower right
        ctx.lineTo(0,SEG_HEIGHT);//lower left
        ctx.closePath();
        ctx.fill();*/
        
        ctx.fillRect(gameObj.wallArr[i].clearance +gameObj.wallArr[i].wall ,i*SEG_HEIGHT , c.width ,SEG_HEIGHT);//right wall
    }
    ctx.fillStyle = "white";
    ctx.font = "20px Comic Sans MS";
    ctx.fillText("Score: "+ gameObj.score , 10, 30);
    
    
    if(gameObj.car_img.id === IMG_ID_CRASH)
    {
        
        ctx.font = "70px Comic Sans MS";
        var txt = "Game Over";
        
        ctx.fillText("Game Over",c.width/2 - Math.round(ctx.measureText(txt).width/2), c.height/2);
    }
    
    
    ctx.drawImage(gameObj.car_img, gameObj.car_location - (gameObj.car_img.width/2), c.height-(gameObj.car_img.height + 10));
    //console.log(getMousePos(gameObj.canvas, null).x);
}

function mainLoop()
{
    var inCanyon = false;
    
    if(gameObj.countDown-- < 0 )//time to make the game harder
    {
        gameObj.countDown = INCREMENT_SPEED;
        
        
        if(gameObj.speed > 65)
        {
           gameObj.speed = gameObj.speed - 4;
           clearInterval(timeObj);//stoping the old loop
           timeObj = setInterval(mainLoop , gameObj.speed);//starting it again
        }
        
        
        if(gameObj.clearance > 145)
        {
            gameObj.clearance = gameObj.clearance -6;//walls are moving in
        }
        
        
        
        gameObj.score++;//player get a point
        
        console.log("game speed:"+gameObj.speed);
        console.log("wall clearance:"+gameObj.clearance);
    }
    
    //var x = event.clientX;
    //Moving the walls here
    if(gameObj.canyonLoc > gameObj.wallArr[0].wall )//do we need to more right?
    {
        gameObj.wallArr.unshift({wall:gameObj.wallArr[0].wall +15, clearance: gameObj.clearance});//move right
    }
    else if(gameObj.canyonLoc < gameObj.wallArr[0].wall )//Do we need to move Left?
    {
        gameObj.wallArr.unshift({wall:gameObj.wallArr[0].wall -14, clearance: gameObj.clearance});//move left
    }
    else
    {
        
        gameObj.wallArr.unshift({wall:gameObj.wallArr[0].wall, clearance: gameObj.clearance});
        gameObj.canyonLoc = randomInt(0, WIDTH - gameObj.clearance)
    }
        
    
    
    
    
    
    
    
    if(gameObj.wallArr.length > HEIGHT/SEG_HEIGHT)
    {
        gameObj.wallArr.pop();
        inCanyon = true;
    }
    
    //hit detection comes last so I can show the play that they hit the wall
    //hit detection 
    
    for(var i = gameObj.wallArr.length-1; inCanyon === true && i > gameObj.wallArr.length -4; i--)
    {
        if(gameObj.car_location-(gameObj.car_img.width/2) < gameObj.wallArr[i].wall  || gameObj.car_location+(gameObj.car_img.width/2) > gameObj.wallArr[i].wall + gameObj.wallArr[i].clearance)//did we hit the left wall
        {
            console.log("Hit left wall");
            gameObj.car_img = document.getElementById(IMG_ID_CRASH);
            clearInterval(timeObj);
            //display();
        }
         
    }
    display();
      
}




// somestuff I'm learing
function getMousePos(canvas, evt) 
{
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
gameObj.canvas.addEventListener('mousemove', function(evt) 
  {
    var mousePos = getMousePos(gameObj.canvas, evt);
    //console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
    gameObj.car_location = mousePos.x;
    if(gameObj.car_img.id === IMG_ID)
    {
        display();
    }
  }, false);
