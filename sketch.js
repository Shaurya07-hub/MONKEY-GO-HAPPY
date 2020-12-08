  var PLAY = 1;
  var END = 0;
  var gameState = PLAY;
  var monkey, monkey_running,monkey_collided;
  var banana, bananaImage, obstacle, obstacleImage;
  var FoodGroup, obstaclesGroup;
  var score;
  var ground;
  var gameOver, GameOverSound, GameOverImage;
  var reset1, resetImage;
  var JumpSound;
  var eatSound;
  var count=0;

function preload() {

  monkey_running = loadAnimation("sprite_0.png","sprite_1.png", "sprite_2.png","sprite_3.png","sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  resetImage= loadImage("reset.jpg");
  GameOverImage = loadImage("gameover.png");
  monkey_collided = loadImage("sprite_1.png");
  
}

function setup() {
  
  createCanvas(600,600);

  //creating ground
  ground = createSprite(600, 570,1000, 100);
  
  //creating monkey
  monkey = createSprite(80,560,80,50);
  monkey.setCollider("rectangle",50,10,300,470);
  monkey.addAnimation("running",monkey_running);
  //monkey.debug = true;  
  monkey.scale=0.18;

  //creating gameover
  gameOver = createSprite(290, 220, 20, 20);
  gameOver.addImage(GameOverImage);
  gameOver.scale = 0.27;

  //creating reset
  reset1 = createSprite(307, 360, 20, 20);
  reset1.addImage(resetImage);
  reset1.scale=0.16;
  
  //creating groups
  obstaclesGroup = new Group();
  FoodGroup = new Group();

  //creating score's initial value as 0
  score = 0;

}


function draw() {

  background("skyblue");
    
  //collide
  monkey.collide(ground);

  //ground moving
  if (ground.x>0) {
    ground.x =width/2;
  }

  //isTouching function
  if (FoodGroup.isTouching(monkey)) {
    FoodGroup.destroyEach();
    count=count+1;
  }
  
  if (gameState === PLAY) {

    //visiblity
    gameOver.visible = false;
    reset1.visible = false;
    
    //speed
    ground.velocityX = -(3 +score / 100);
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //jump when the space key is pressed
    if (keyDown("space") && monkey.y >=475)   {
      monkey.velocityY = -20;
    }
  
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8;

    //spawn obstacles on the ground
    spawnObstacles();
    spawnBanana();

    //isTouching function
    if (obstaclesGroup.isTouching(monkey)) {
      gameState = END;
      
    }

  } else if (gameState === END) {
    
    //visiblity
    gameOver.visible = true;
    reset1.visible = true;
   
    //monkey image
    monkey.addAnimation("running", monkey_collided);
    
    //restart
    if (mousePressedOver(reset1)) {
      reset();
    
    }
    
    //velocity  
    ground.velocityX = 0;
    monkey.velocityY = 0;
      
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    FoodGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    FoodGroup.setVelocityXEach(0);

   }

  drawSprites();

  //text
  fill("black");
  textSize(30);
  text("SURVIVAL TIME: " + score,190,50);
  text("SCORE:"+count,250,90)
  
  
}

function reset() {
  
  // console.log("game is restarted");
  gameState = PLAY;
  score = 0;
  count = 0;
  obstaclesGroup.destroyEach();
  FoodGroup.destroyEach();
  monkey.addAnimation("running",monkey_running);

  
}

function spawnObstacles() {
  
    if (frameCount % 120 === 0) {
    var  obstacle = createSprite(600, 460, 10, 40);
    obstacle.velocityX = -(6 + score / 100);
    obstacle.addImage(obstacleImage);
    obstacle.setCollider("circle",0,20,40)
    //obstacle.debug=true;  
    obstacle.velocityX = -(12+score /100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));

    obstacle.scale = 1.1;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);

  }
}

function spawnBanana() {
  
    //write code here to spawn the food
    if (frameCount % 90 === 0) {
    var banana = createSprite(600, 450, 40, 10);
    banana.y = Math.round(random(250 ,400));
    banana.addImage(bananaImage);
    banana.scale = 0.13;
    banana.velocityX = -8;   
    banana.velocityX = -(12+score/100);
      
    //assign lifetime to the variable
    banana.lifetime = 200;

    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;

    //add each cloud to the group
    FoodGroup.add(banana);
  }
}

