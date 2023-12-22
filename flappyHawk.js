
// board
let board;
let boardWidth = 360; 
let boardHeight = 640; 
let context; 

//bird

let birdHeight = 24;
let birdWidth = 34; 
let birdx = boardWidth/8; // to determine the starting position of the bird
let birdy = boardHeight/2;
let birdImg;

//pipes 
let pipeArray = []; 
let pipeWidth = 64; 
let pipeHeight = 512; 
let pipeX = boardWidth; 
let pipeY = 0; 

let topPipeImg; 
let bottomPipeImg; 

// game Physiques

let velocityX = -1.5;
let velocityY = 0; //this is the bird jump speed
let gravity = 0.1;
let backInTime = false; 

let gameOver = false; 
let score = 0; 

let bird = {
    x : birdx,
    y : birdy,
    width: birdWidth,
    height: birdHeight

    
}

window.onload = function (){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // this is what we use to draw on the board. 


    //drawing the bird
    context.fillStyle = "green";
    context.fillRect(bird.x, bird.y, bird.width, birdHeight);

    // loading the image
    birdImg = new Image();
    birdImg.src = "./hawk.png";

    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width + 8, bird.height + 2);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";
    
   requestAnimationFrame(update);
   setInterval(placePipe, 1500)

   document.addEventListener('keydown', moveBird)
}


function update () {
    requestAnimationFrame(update);
    
    if (gameOver){
        velocityX = -1.5;
        return; 
    }
    context.clearRect(0, 0, board.height, board.height)
    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // 0 is the top of the convas
    context.drawImage(birdImg, bird.x, bird.y, bird.width + 8, bird.height + 2);

    if (bird.y >= 610){
        
        gameOver = true; 
    }


    // pipes
  
    for( let i = 0; i < pipeArray.length; i++ ){ // this is because we need to loop though each pipe and decrement its x position. 
        let pipe = pipeArray[i];
        velocityX -= 0.00025; // this is to make the game faster and faster. 
       
        pipe.x += velocityX ;
       

      
      
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x  > pipe.x + pipe.width){
            score += 1/2;
            pipe.passed = true; 
        }

        if (detectCollision (bird, pipe)){
            gameOver = true; 
        }
    }

    // clearing pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift(); // this will remove the useless pipe. 
    }
    // scoring
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText (score, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER!!!", 25, 290);
    }
    }


function placePipe () {
    if (gameOver){
        velocityX = -1.5;
        return; 
        
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

   if (!backInTime) {pipeArray.push(topPipe);}

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    if (!backInTime) {pipeArray.push(bottomPipe);}
}

function moveBird (e){
    if(e.code == 'Space' || e.code == 'ArrowUp'){
        velocityY = -3;

        //to reset the game
        if(gameOver){
            bird.y = birdy;
            pipeArray = [];
            score = 0; 
            gameOver = false; 
        }
    }

    if (e.code == 'KeyW'){
        let currentVelocityX = velocityX;
        velocityX = -9;
        gravity = 0; 
        birdImg.src = "./hawk_dash_sprint.png";

        setTimeout(() => {
            velocityX = currentVelocityX;
            gravity = 0.1;
            birdImg.src = "./hawk.png";
        }, 300);
    }


    
    if (e.code == 'KeyE'){ // super jump 
        
        let currentVelocityX = velocityX;
        velocityX = -0.5;
        velocityY = -17.5; 
        birdImg.src = "./hawk_dash_sprint.png";

        setTimeout(() => {
            velocityX = -1.5;
            velocityY = 0;
            birdImg.src = "./hawk.png";
        }, 100);
    }

    if (e.code == 'KeyD'){
        let currentVelocityX = velocityX;
        velocityX = -0.5;
        gravity = 0.11; 
       
        setTimeout(() => {
            velocityX = currentVelocityX;
            gravity = 0.1;
        }, 5000);
    }
}

function detectCollision (a , b){
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height> b.y

}