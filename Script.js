/*obstacles in this code 
1. I always forget to call the draw function thereby thinking the code didnt work
2. HAd to follow the canvas API close KNit

*/
const rulesBtn = document.getElementById('rules-btn')
const closeBtn = document.getElementById('close-btn')
const rules = document.getElementById('rules')
const canvas = document.getElementById('canvas');


// used the canva API on MDN
const ctx = canvas.getContext('2d');


let score =  0;
let highestScore = 0;
const brickRowCount = 9; // create 9 rows
const brickColCount = 5; // create 9 columns







//create ball object props
const ball = {
    //the ball position to start in the middle
    x: canvas.width / 2,
    y:canvas.height / 2,
    size: 10,
    speed: 4,
    dx : 4,
    dy: -4
}
//create ppaddle props (object)
const paddle ={
    x: canvas.width/2  - 40,
    y: canvas.height - 20,
    w:80,
    h:10,
    speed : 8,
    dx :0,
}

//create brick props
const brickInfo = {
    w:70,
    h:20,
    padding:10,
    offsetX:45,
    offsetY:60,
    visible: true
}




//function drawbrick
const bricks = [];
for(let i = 0; i < brickRowCount; i++){
    bricks[i] = [];
    for (let j = 0; j < brickColCount; j++){
        const x = i *(brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j *(brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = {x,y, ...brickInfo};
        
    }
}
console.log(bricks);



//draw ball on canvas
function drawBall(){
 ctx.beginPath();
 //ctx.arc(coordinatex , coordinatey, radius(size) , startAngle(0), endAngle(pi*2 full circle))
 ctx.arc(ball.x, ball.y , ball.size , 0 ,  3.142 * 2);
 ctx.fillStyle ='#3c857c';
 ctx.fill();
 ctx.closePath();
}

//draw paddle
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y , paddle.w, paddle.h)
    ctx.fillStyle ='#3c857c';
    ctx.fill();
    ctx.closePath();
}

//draw bricks
function drawBricks(){
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#3c857c' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}




function drawScore(){
    ctx.font = '12px sans-serif';
    //hang it top right
    ctx.fillText(`Score:${score}`, canvas.width - 100,30);
    ctx.fillText(`Highest Score:${highestScore}`, canvas.width - 100, 50); 
}





function movePaddle(){
    paddle.x += paddle.dx;

    //wall detection
    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w;
    }

  if(paddle.x < 0){
    paddle.x = 0;
  }
}







function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
    //wall collision(horizontal sides)
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.dx *= -1 // to make the ball tunaroud , converting dx to it's 
        //value
}

//wall collision (vertical Y axis)
if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
    ball.dy *= -1//make the ball go opposite way
}

// console.log(ball.x, ball.y)

//paddle collision(Phew!)
if(ball.x - ball.size > paddle.x && ball.x + ball.size <
     paddle.x + paddle.w && ball.y + ball.size > paddle.y){

        ball.dy = -ball.speed;
}

//brick collsion
bricks.forEach(column => {
    column.forEach(brick => {
        if(brick.visible){
            if(ball.x - ball.size > brick.x && // left side check
                ball.x + ball.size < brick.x + brick.w && //right side check
                
                //top and bottom
                ball.y + ball.size > brick.y && ball.y -ball.size<brick.y + brick.h){
                        ball.dy *= -1;//opposite side
                        brick.visible = false;

                        increaseScore();
                }

        }
    })
})
//hit bottom wall 
if(ball.y + ball.size > canvas.height){
    showAllBricks();
    score = 0;
    highestScore = highestScore;  // don't reset highestScore 
}
}

//increase score 
function increaseScore(){
    score++;
    if(score > highestScore) {
        highestScore = score;
    }
    if(score % (brickRowCount * brickRowCount) == 0){
        showAllBricks();
    }
}

//make all bricks 
function showAllBricks(){
    bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true))
    })
}




//draw everything

function draw(){
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall()
    drawPaddle();
    drawScore();
    drawBricks()
    }

    
    

    //update canvas
    function update() {
        moveBall();
        movePaddle();
        draw();
        requestAnimationFrame(update);
    }

    update();
    
    function keyDown(e) {
        if(e.key == 'Right' || e.key == 'ArrowRight'){
            paddle.dx = paddle.speed;
        } else if(e.key === 'Left' || e.key === 'ArrowLeft'){
            paddle.dx = -paddle.speed;

        }
    }

    



    function keyUp(e) {
        if(e.key==='Right' || e.key === 'ArrowRight'|| e.key == 'Left' 
        || e.key === 'ArrowLeft'){
            paddle.dx =0;


        }
    }

    function saveHighestScore() {
        localStorage.setItem('highestScore', highestScore); 
    }
    
    function loadHighestScore() {
        highestScore = localStorage.getItem('highestScore'); 
        if(!highestScore) {
            highestScore = 0; 
        }
    } 

    

    //keyboard events
    document.addEventListener('keydown',keyDown);
    document.addEventListener('keyup',keyUp);


//rules and close event handlers
rulesBtn.addEventListener('click',() =>
 rules.classList.add('show'));

 closeBtn.addEventListener('click',() =>
 rules.classList.remove('show'));

 let musicEnabled = true;
const bgMusic = document.querySelector('#bg-music');

const toggleMusicButton = document.querySelector('#toggle-music-button');
toggleMusicButton.addEventListener('click', toggleMusic);

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp') {
    toggleMusic();
  }
});

function toggleMusic() {
  musicEnabled = !musicEnabled;   
  if (musicEnabled) {
    bgMusic.play();  
  } else {
    bgMusic.pause();       
  }
}