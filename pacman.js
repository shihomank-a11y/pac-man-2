let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount*tileSize;
const boardHeight = rowCount*tileSize;
let context;
//images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanDownImage;
let pacmanUpimage;
let pacmanRightImage;
let pacmanLeftImage;
let wallImage;


window.onload = function(){
    board = document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");
    loadImages();
    loadMap();
    // console.log(walls.size);
    // console.log(foods.size);
    // console.log(ghosts.size);
    update();
    document.addEventListener("keyup", movePacman);
}
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];


const walls = new Set();
const foods = new Set();
const ghosts = new Set();


function loadImages(){
    wallImage = new Image();
    wallImage.src = "./wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "./blueGhost.png";
    orangeGhostImage = new Image();
    orangeGhostImage.src = "./orangeGhost.png";
    pinkGhostImage = new Image();
    pinkGhostImage.src = "./pinkGhost.png";
    redGhostImage = new Image(); 
    redGhostImage.src = "./redGhost.png";   
   
   
     pacmanDownImage = new Image();
    pacmanDownImage.src = "./pacmanDown.png";
    pacmanUpimage = new Image();
    pacmanUpimage.src = "./pacmanUp.png";
    pacmanRightImage = new Image();
    pacmanRightImage.src = "./pacmanRight.png";
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./pacmanLeft.png";
}


function loadMap(){
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let r=0;r<rowCount;r++){
        for(let c=0;c<columnCount;c++){
            const row = tileMap[r];
            const tileMapChar = row[c];


            const x = c*tileSize;
            const y = r*tileSize;
            if (tileMapChar == 'X'){
                const wall = new Block(wallImage ,x ,y ,tileSize ,tileSize);
                walls.add(wall);
            
            }
            else if(tileMapChar == 'b'){
             const ghost = new Block(blueGhostImage ,x ,y ,tileSize ,tileSize);
             ghosts.add(ghost);
            }
            else if(tileMapChar == 'o'){
             const ghost = new Block(orangeGhostImage ,x ,y ,tileSize ,tileSize);
             ghosts.add(ghost);
            }
            else if(tileMapChar == 'p'){
            const ghost = new Block(pinkGhostImage ,x ,y ,tileSize ,tileSize);
             ghosts.add(ghost);
            }
            else if(tileMapChar == 'r'){
             const ghost =new Block(redGhostImage ,x ,y ,tileSize ,tileSize);
             ghosts.add(ghost);
            
             }
             else if (tileMapChar == 'P'){
              pacman = new Block(pacmanRightImage, x ,y ,tileSize ,tileSize);

             }
             else if(tileMapChar == ' '){
                const food = new Block(null ,x+14 ,y+14 ,4 ,4);
                foods.add(food);
             }
            }
        }
    }


function update() {
    move();
    draw();
    //settimeout to be used for 20fps
    setTimeout(update,50);
}
function draw(){
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    for (let ghost of ghosts.values()){
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }
    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }
    context.fillStyle = "White";
    for (let food of foods.values()){
        context.fillRect(food.x, food.y, food.width, food.height);
    }
}
function move(){
     pacman.x += pacman.velocityX;
     pacman.y += pacman.velocityY;

     for(let wall of walls.values()){
        if (collision (pacman,wall)){
            pacman.x -=pacman.velocityX;
            pacman.y -=pacman.velocityY;
            break;
        }
     }
}

function movePacman(e) {
    if(e.code == "ArrowUp" || e.code == "keyW"){
        pacman.updateDirection('U');
    }
    if(e.code == "ArrowDown" || e.code == "keyS"){
        pacman.updateDirection('D');
    }
    if(e.code == "ArrowLeft" || e.code == "keyA"){
        pacman.updateDirection('L');
    }
    if(e.code == "ArrowRight" || e.code == "keyD"){
        pacman.updateDirection('R');
    }
}
function collision (a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
class Block{
    constructor(image ,x ,y ,width ,height){
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.velocityX =0;
        this.velocityY = 0;

    }
    updateDirection(direction){
        this.direction = direction;
        this.updateVelocity();
        this.x += this.velocityX;
        this.y += this.velocityY;

        for (let wall of walls.values()){
            if (collision(this, wall)){
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction = prevDirection;
                this.updateVelocity();
                return;
            }
        }
    }
    updateVelocity(){
        if(this.direction == 'U'){
            this.velocityX = 0;
            this.velocityY = -tileSize/4;
        }
        else if (this.direction == 'D'){
              this.velocityX = 0;
            this.velocityY = tileSize/4
        }
        else if (this.direction == 'L'){
              this.velocityX = -tileSize/4;
            this.velocityY = 0;
        }
        else if (this.direction == 'R'){
             this.velocityX = tileSize/4;
            this.velocityY = 0;
        }
    }
}