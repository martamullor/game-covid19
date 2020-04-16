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



  // Time & Points

  _drawTime(){
    let time = document.getElementById("segundos");
    time.innerHTML = this.time;
  }

  _drawPoints(){
    let points = document.getElementById("number");
    points.innerHTML = this.points;
  }

  _drawJewelNumber(){
    let jewelNumber = document.getElementById("jewelNumber");
    jewelNumber.innerHTML = this.jewel;
  }

  _drawOxygen(){
    let heightOxygenImage = document.getElementById("container-oxygen-full");
    heightOxygenImage.style.height = `${this.heightNumber}px`;
  }




  // GameOver 

  _gameOver(){
    if (this.time === 0){
      this._stop();
      this._printGameOver();
    }
  }


  _printGameOver() {
    const gameOver = document.getElementById('gameOver');
    gameOver.style = "display:block";
    const gameOverTitle = document.getElementById('gameOverTitle');
    gameOverTitle.style = "display:block";
    canvas.style = "display:none";
    time.style = "display:none";
    points.style = "display:none";
    const containerImage = document.getElementById("image-container");
    containerImage.style = "display:none;";
    const containerPoints = document.getElementById("container-points");
    containerPoints.style = "display: none";
  }


  // Background 

  _drawBackground() {
      this.background.image = new Image();
      this.background.image.src = "./img/background.jpg";
      this.ctx.drawImage( this.background.image, this.background.x, this.background.y, this.background.width, this.background.height);
  };


  _moveBackground() { 
    this.intervalBackground = setInterval(() => {
      if (this.background.y < -this.canvasHeight){
        this.background.y = 0;
      } else {
        this.background.y -= 2;
      }
    }, 20);
  };
  

  
  // Player Elements


  _drawPlayer() {
    
    this.ctx.drawImage( this.player.image, this.player.x, this.player.y, this.player.width, this.player.height);
  };



  _assignControlsToKeys() {
    document.addEventListener('keydown', e => {
      e.preventDefault();
      switch (e.keyCode) {
        case 37: // arrow left
          console.log("Left");
          //this.player.movement.play();
          this.player.moveLeft(); 
          if (this.player.x < 0){
            this.player.x = 0; 
          } 
          break;
        case 39: // arrow right
          console.log("right");
          //this.player.movement.play();
          this.player.moveRight();
          if (this.player.x > this.canvasWidth){
            this.player.x = this.canvasWidth; 
          } 
          break;
        case 32: // space 
          this._pause();
          this.pause = !this.pause;
          break;
      }
    });
  } 

// Obstacle Elements

  _generateObstacle() { 
    this.intervalEnemies = setInterval(() => {
      this.obstacle.push(new Obstacle(60, 60, this._getRandomNumber(this.canvasWidth), 0, "enemy"));
      this.time -= 3; 
      this.heightNumber -= 5;
    }, 1500);
  };


  _generateOxygen() { 
    this.intervalOxygen = setInterval(() => {
      this.obstacle.push(new Obstacle(60, 60, this._getRandomNumber(this.canvasWidth), 0, "oxygen"));
    }, 3000);
  };


  _generateJewel() { 
    this.intervalJewel = setInterval(() => {
      this.obstacle.push(new Obstacle(50, 50, this._getRandomNumber(this.canvasWidth), 0, "jewel"));
    }, 5100);
  };


  _moveObstacle(){
    for (let i = 0; i < this.obstacle.length; i++) {
        this.obstacle[i].y += 2;
        this._deleteObstacles();
        this._collidesWithObstacle();
      }
  };


  _deleteObstacles(){
    this.obstacle.forEach((element) => {
      if (element.y + element.height === this.canvasHeight+50){
        this.obstacle.shift();
      }
    })
   };


   _collidesWithObstacle() {
    this.obstacle.forEach((element, position) => {    
        if (element.y + element.height >= this.canvasHeight - this.player.height && 
            (
                ( element.x + element.width >= this.player.x &&
                  element.x + element.width <= this.player.x + this.player.width) 
                ||
                (this.player.x + this.player.height >= element.x &&
                this.player.x + this.player.height <= element.x + element.width)
            )) { 
            if (element.type === "enemy"){
              this.enemiesSound.play();
              this._stop();
              this._printGameOver();
            } else if (element.type === "oxygen") {
              this.points += 5;
              this.time += 5;
              this.heightNumber += 15;
              this.oxygenSound.play();
              this.obstacle.splice(position, 1);
            } else {
              this.points += 20;
              this.jewel += 1;
              this.jewelSound.play();
              this.obstacle.splice(position, 1);
            }
        }
    });
  };


  _drawObstacle() {  
    this.obstacle.forEach(element => {
      if (element.type === "enemy"){
        this.obstacle.image = new Image();
        this.obstacle.image.src = "./img/enemy.png";
        this.ctx.drawImage(this.obstacle.image, element.x, element.y, element.width, element.height);
      } else if ( element.type === "oxygen"){
        this.obstacle.image = new Image();
        this.obstacle.image.src = "./img/oxygen.png";
        this.ctx.drawImage(this.obstacle.image, element.x, element.y, element.width, element.height);
      } else {
        this.obstacle.image = new Image();
        this.obstacle.image.src = "./img/gem.png";
        this.ctx.drawImage(this.obstacle.image, element.x, element.y, element.width, element.height);  
      }
    });
  };


  _getRandomNumber(max){
    return Math.floor(Math.random() * (max - 0)) + 0;  
  };



// BUCLES 

  start(){
    this._assignControlsToKeys();
    this._generateObstacle();
    this._generateOxygen();
    this._generateJewel();
    this._moveBackground();
    this.interval = window.requestAnimationFrame(this._update.bind(this));
  };


  // Limpiado

  _clear(){
    this.ctx.clearRect(0,0,886,600);
  };

  // Stop All

  _stop(){
    console.log('stop');
    this.interval = clearInterval(this.interval);    
    this.intervalEnemies = clearInterval(this.intervalEnemies);
    this.intervalOxygen = clearInterval(this.intervalOxygen);
    this.intervalJewel = clearInterval(this.intervalJewel);
    this.intervalBackground = clearInterval(this.intervalBackground);    
  };

  // Pause 


  _pause() {
    console.log('this.pause :', this.pause);
    if (!this.pause) {
      console.log("pause active");
      this.intervalEnemies = clearInterval(this.intervalEnemies);
      this.intervalOxygen = clearInterval(this.intervalOxygen);
      this.intervalJewel = clearInterval(this.intervalJewel);
      this.intervalBackground = clearInterval(this.intervalBackground);    
      this.interval = window.cancelAnimationFrame(this.interval);
      let pauseText = document.getElementById("pauseText");
      pauseText.style = "display:block";
    } else if (this.pause) {
      console.log("pause inactive");
      pauseText.style = "display:none";
      this.start();
      //this.interval = window.requestAnimationFrame(this._update.bind(this));
    }
  };
 

  // Update function

  _update() {

    this._clear();
    this._drawBackground();
    this._drawObstacle();
    this._drawPlayer();
    this._moveObstacle();
    this._drawTime();
    this._drawPoints();
    this._drawJewelNumber();
    this._drawOxygen();
    this._gameOver();

    if (!!this.interval) {
      this.interval = window.requestAnimationFrame(this._update.bind(this));
    }    
  }
}



