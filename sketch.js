var PLAY = 1;
var END = 0;
var gameState = PLAY;


var mario,mario_running,groundImg,ground,backImg,bg;
var invisibleGround,bricks,bricksImg;
var obstacle1,obstacle2,obstacle3,obstacle4;
var obstacleGroup,bricksGroup,score,mario_collided;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

function preload()
{
  mario_running=loadAnimation("mario02.png","mario01.png","mario02.png","mario03.png");
  
  groundImg=loadImage("ground2.png");
  
  backImage=loadImage("bg.png");
  bricksImg=loadImage("brick.png");
  
  obstacle1=loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  mario_collided=loadAnimation("collided.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
   jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup()
{
  
  createCanvas(600,300);
  
  bg=createSprite(300,180,600,10);
  bg.addImage("bg",backImage);
  
  mario=createSprite(50,240,30,30);
  mario.addAnimation("mariorunning",mario_running);
  mario.addAnimation("mariocollided",mario_collided);
  mario.scale=1.4;
  
  ground=createSprite(200,280,600,10);
  ground.addImage("ground",groundImg);
  
  groundImg=loadImage("ground2.png");
  backImage=loadImage("bg.png");
  
  invisibleGround=createSprite(200,250,600,10);
  invisibleGround.visible=false;
   bricksGroup = new Group();
  obstacleGroup = new Group();
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  score=0;
}

function draw()
{
  
  
  background("white");
  if(gameState===PLAY)
  {
       gameOver.visible = false;
        restart.visible = false;

       ground.velocityX = -(4 + 3* score/100)
        //scoring
        score = score + Math.round(getFrameRate()/60);

        if(score>0 && score%100 === 0){
           checkPointSound.play() 
        }

       if(ground.x<0)
        {
          ground.x=ground.width/2;
        }
    
      if(keyDown("space")&&mario.y>100)
        {
          mario.velocityY=-12;
           jumpSound.play();

        }
    
     //add gravity
    mario.velocityY = mario.velocityY + 0.8

     // ground.velocityX=-3;
       spawnObstacles();
       spawnBricks();

      if(obstacleGroup.isTouching(mario)){
            //trex.velocityY = -12;
            jumpSound.play();
            gameState = END;
            dieSound.play();
      }
    }
 
  else if (gameState === END) {
    
      gameOver.visible = true;
      restart.visible = true;
     
     //change the mario animation
      mario.changeAnimation("mariocollided",mario_collided); 
    
      ground.velocityX = 0;
     // mario.velocityY = 0
      
     //set lifetime of the game objects so that they are never destroyed
     obstacleGroup.setLifetimeEach(-1);
     bricksGroup.setLifetimeEach(-1);
     
     obstacleGroup.setVelocityXEach(0);
     bricksGroup.setVelocityXEach(0);   
    if(mousePressedOver(restart)) {
      reset();
     }
   }
  
 
  //stop mario from falling down
  mario.collide(invisibleGround);
   
  drawSprites();
   //displaying score
  fill('red');
  textSize(16);
  text("Score: "+ score, 520,20);
}


function spawnBricks()
{
 if(frameCount%60===0)
   {
  bricks=createSprite(600,250,50,50);
  bricks.y=Math.round(random(110,180));
  bricks.addImage(bricksImg);
     bricks.velocityX=-3;
     
     bricks.lifetime=200;  
     bricks.depth=mario.depth;
     mario.depth++;
     bricksGroup.add(bricks);
   }
}

function spawnObstacles()
{
  if(frameCount%100===0)
    {
      var obstacles=createSprite(400,220,30,30);
      
      obstacles.velocityX=-6;
      
      rand=Math.round(random(1,4));
      console.log(rand);
     
      obstacles.addAnimation("anim",obstacle1);
      obstacles.lifetime=300;
      obstacleGroup.add(obstacles);
      
    }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstacleGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("mariorunning",mario_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
