# COVID INVADERS

Reinterpretación del clásico juego space invaders adaptado a la situación actual del COVID-19.

* * *
### Technique
Html5 __Canvas__ and Vanilla __Javascript__

* * *
## Data structure 
__main.js__
````
  game = new Game({ctx}, 
    new Player(45,45,200,520),
    canvas.width-100, 
    canvas.height);

  
    function start(){
      canvas.style = "display:block";
      game.start();

     function restart(){
      canvas.style = "display:block";

        game = new Game({ctx}, 
          new Player(45,45,200,520),
          canvas.width - 100, 
          canvas.height);
      
      game.start();
      
      
````
__Game.js__

````
class Game {
  constructor(options, player, canvasWidth, canvasHeight) {
    this.ctx = options.ctx;
    this.player = player;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.laser = [];
    this.enemies = [];
    this.enemiesLaser = [];
    this.extraPoints = [];
    this.interval = undefined;
    this.intervalEnemiesLaser = undefined;
    this.intervalEnemiesMoveDown = undefined;
    this.intervalExtraPoints = undefined;
    this.points = 0;
    this.enemiesKilledSound = new Audio();
    this.enemiesKilledSound.src = './sound/invaderkilled.wav';
    this.laserGun = new Audio();
    this.laserGun.src = './sound/Laser-Gun-SoundEffect.mp3';
    this.youWinSound = new Audio();
    this.youWinSound.src = './sound/YouWin-sound.mp3';
    this.gameOverSound = new Audio();
    this.gameOverSound.src = './sound/gameover.mp3';
  }

    _assignControlsToKeys();
    _generateEnemies();
    _generateEnemiesLaser();
    _generateExtraPoints();
    _moveDownEnemies();
    _clear();
    _stop();
    _update();
    _drawPlayer();
    _drawLaser();
    _drawExtraPoints();
    _moveExtraPoints();
    _moveLaser();
    _drawEnemies();
    _drawEnemiesLaser();
    _moveEnemiesLaserDown();
    _drawPoints();
    _numberEnemiesScreen();
    _collidesExtraPoint();
    _deleteExtraPoints();
    _deleteEnemiesLaser();
    _collidesWithLaserEnemies();
    _numberEnemiesScreen();
    _collidesEnemies();
    _deleteLaser();
    _collidesLaser();

````
__Player.js__

````
class Player {
  constructor(width,height, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "./img/testtube.png";
  }

  moveRight();
  moveLeft();

````
__Laser.js__

````
class Laser {
    constructor(width,height,x, y){
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
    }    
}    

````
__ExtraPoints.js__

````
class ExtraPoints {
  constructor(width,height,x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }    
}    

````
__Enemy.js__

````
class Enemy {
  constructor(width,height,x, y, type){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.type = type;
  }    
}  

````
__EnemiesLaser.js__

````
  
class EnemiesLaser {
    constructor(width,height,x, y){
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
    }    
} 

````
