# COVID 19

El usuario debe esquivar y matar al virus. 

* * *
## MVP
### Technique
Html5 __Canvas__ and Vanilla __Javascript__
### Game states
* __Start Screen__
  * Title
  * Play button
* __Game Screen__
  * Canvas
* __Game Over Screen__
  * Play again button
  * Go to start screen button
### Game
* Create obstacles
* Create player
* Move player
* Click on any button to move the player from right to left of the board.
* Create obstacles, oxygen and gems random in the canvas.
* Check collision
* In case of collision -> Game Over -> Show Game Over screen
* In case of running out of oxygen -> Game Over -> Show Game Over screen
* * *
## BACK LOG
### Score
* Run counter and store score on game over
### High score
* Create High Score Screen
* Show latest score on Start Screen
* Add high score button to Start Screen
### Music
* Add sound in collisions 
* * *
## Data structure 
__main.js__
````
  game = new Game({ctx}, 
    new Player(80,80,200,500),
    new Background(886,3130,0,0), 
    canvas.width-100, 
    canvas.height);

  
    function start(){
      canvas.style = "display:block";
      game.start();
````
__Game.js__
````
class Game {
  constructor(options, player,background,canvasWidth,canvasHeight){
    this.ctx = options.ctx;
    this.player = player;
    this.background = background;
    this.interval = undefined;
    this.intervalEnemies = undefined;
    this.intervalOxygen = undefined;
    this.intervalJewel = undefined;
    this.obstacle = [];
    this.intervalBackground = undefined;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.time = 60;
    this.points = 0;
    this.jewel = 0;
    this.pause = false;
    this.enemiesSound = new Audio();
    this.enemiesSound.src = './sound/enemies.mp3';
    this.oxygenSound = new Audio();
    this.oxygenSound.src = "./sound/oxygen.mp3";
    this.jewelSound = new Audio();
    this.jewelSound.src = "./sound/jewel.mp3";
    this.heightNumber = 170;
  }

   _update();
   _pause();
   _stop();
   _clear();
   _getRandomNumber(max);
   _drawObstacle();
   _collidesWithObstacle();
   _deleteObstacles();
   _moveObstacle();
   _generateJewel();
   _generateOxygen();
   _generateObstacle();
   _assignControlsToKeys();
   _drawPlayer();
  _moveBackground();
  _drawBackground();
  _printGameOver();
  _gameOver();
  _drawOxygen();
  _drawJewelNumber();
  _drawPoints();
  _drawTime();

````
__Player.js__
````
class Player {
  constructor(width,height, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = "green";
    this.image = undefined;
    this.movement = new Audio();
    this.movement.src = "./sound/movement.mp3";
    this.image = new Image();
    this.image.src = "./img/astronaut.png";
  }

  moveRight();
  moveLeft();

Player.move();
````
__Obstacles.js__
````
class Obstacle {
    constructor(width,height, x, y,type){
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.type = type;
      this.interval = undefined;
    }
    

````