class Game {
  constructor(options, player, canvasWidth, canvasHeight) {
    this.ctx = options.ctx;
    this.player = player;
    this.interval = undefined;
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
    this.laser = [];
    this.enemies = [];
    this.enemiesLaser = [];
    this.intervalEnemiesLaser = undefined;
    this.intervalEnemiesMoveDown = undefined;
  }


  // Time & Points

  _drawTime() {
    let time = document.getElementById("segundos");
    time.innerHTML = this.time;
  }

  _drawPoints() {
    let points = document.getElementById("number");
    points.innerHTML = this.points;
  }

  _drawJewelNumber() {
    let jewelNumber = document.getElementById("jewelNumber");
    jewelNumber.innerHTML = this.jewel;
  }

  _drawOxygen() {
    let heightOxygenImage = document.getElementById("container-oxygen-full");
    heightOxygenImage.style.height = `${this.heightNumber}px`;
  }


  // GameOver 

  _gameOver() {
    if (this.time === 0) {
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


  // Player Elements

  _drawPlayer() {
    this.ctx.drawImage(this.player.image, this.player.x, this.player.y, this.player.width, this.player.height);
  };


  _assignControlsToKeys() {
    document.addEventListener('keydown', e => {
      e.preventDefault();
      switch (e.keyCode) {
        case 37: // arrow left
          console.log("Left");
          this.player.moveLeft();
          if (this.player.x < 0) {
            this.player.x = 0;
          }
          break;
        case 39: // arrow right
          console.log("right");
          this.player.moveRight();
          if (this.player.x > 820) {
            this.player.x = 820;
          }
          break;
        case 32: // laser 
          this._generateLaser()
          break;
      }
    });
  }

  /* Laser */

  _drawLaser() {
    this.laser.forEach(element => {
      this.laser.image = new Image();
      this.laser.image.src = "./img/science.png";
      this.ctx.drawImage(this.laser.image, element.x, element.y, element.width, element.height);
    })
  }

  _generateLaser() {
    this.laser.push(new Laser(40, 40, this.player.x, this.player.y));
  };


  _moveLaser() {
    for (let i = 0; i < this.laser.length; i++) {
      this.laser[i].y -= 5;
      this._deleteLaser();
    }
  };

  _deleteLaser() {
    this.laser.forEach((element) => {
      if (element.y + element.height === 0) {
        this.laser.shift();
      }
    })
  };

  /* Enemies */

  _drawEnemies() {
    this.enemies.forEach(element => {
      if (element.type === "enemy"){
        this.enemies.image = new Image();
        this.enemies.image.src = "./img/enemy.png";
        this.ctx.drawImage(this.enemies.image, element.x, element.y, element.width, element.height);
      } else if ( element.type === "no-mask"){
        this.enemies.image = new Image();
        this.enemies.image.src = "./img/no-mask.png";
        this.ctx.drawImage(this.enemies.image, element.x, element.y, element.width, element.height);
      } else {
        this.enemies.image = new Image();
        this.enemies.image.src = "./img/contact.png";
        this.ctx.drawImage(this.enemies.image, element.x, element.y, element.width, element.height);  
      }
    });
  }

  _generateEnemies() {
    for (let i = 0; i < 10; i++) {
      this.enemies.push(new Enemies(50, 50, 80 + (i * 70), 80, 'enemy'));
      this.enemies.push(new Enemies(50, 50, 80 + (i * 70), 180, 'no-mask'));
      this.enemies.push(new Enemies(50, 50, 80 + (i * 70), 280, 'contact'));
    }
  };

  _moveDownEnemies() { 
    this.intervalEnemiesMoveDown = setInterval(() => {
      for (let i = 0; i < this.enemies.length; i++){
        if (this.enemies[i].type === 'no-mask'){
          this.enemies[i].y += 5; 
          this._collidesWithEnemies();
        } else if (this.enemies[i].type === 'enemy'){
          this.enemies[i].y += 6; 
          this._collidesWithEnemies();
        }
      }  
    }, 100);
  };

  /*
  _moveEnemies() {
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies.x < 1000){
        this.enemies[i].x += 1;
        console.log(this.enemies[i].x)
      } else if (this.enemies.x > 0) {
        this.enemies[i].x -= 1;
      }
    }
  };
  */

 _collidesWithEnemies() {
  this.enemies.forEach((element, position) => {    
      if (element.y + element.height >= this.canvasHeight - this.player.height && 
          (
              ( element.x + element.width >= this.player.x &&
                element.x + element.width <= this.player.x + this.player.width) 
              ||
              (this.player.x + this.player.height >= element.x &&
              this.player.x + this.player.height <= element.x + element.width)
          )) { 
          if (element.type === "enemy" || "contact" || "no-mask"){
            this._stop();
            this._printGameOver();
          } 
      }
  });
};

  /* Enemies Laser */

  _drawEnemiesLaser() {
    this.enemiesLaser.forEach(element => {
      this.enemiesLaser.image = new Image();
      this.enemiesLaser.image.src = "./img/covid.png";
      this.ctx.drawImage(this.enemiesLaser.image, element.x, element.y, element.width, element.height);
    })
  }

  _generateEnemiesLaser() { 
    this.intervalEnemiesLaser = setInterval(() => {
      this.enemiesLaser.push(new EnemiesLaser(40, 40, this._getRandomIntInclusive(20, 700), this.enemies[0].y));
    }, 3000);
  };

  _moveEnemiesLaser(){
    for (let i = 0; i < this.enemiesLaser.length; i++) {
        this.enemiesLaser[i].y += 2;
        this._deleteEnemiesLaser();
      }
  };


  _deleteEnemiesLaser(){
    this.enemiesLaser.forEach((element) => {
      if (element.y + element.height === this.canvasHeight+50){
        this.enemiesLaser.shift();
      }
  })
}


  _getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }




  // BUCLES 

  start() {
    this._assignControlsToKeys();
    this._generateEnemies();
    this._generateEnemiesLaser();
    this._moveDownEnemies();
    this.interval = window.requestAnimationFrame(this._update.bind(this));
  };


  // Limpiado

  _clear() {
    this.ctx.clearRect(0, 0, 886, 600);
  };

  // Stop All

  _stop() {
    this.interval = clearInterval(this.interval);
    this.intervalLaser = clearInterval(this.intervalLaser);
    this.intervalEnemiesLaser = clearInterval(this.intervalEnemiesLaser);
    this.intervalEnemiesMoveDown = clearInterval(this.intervalEnemiesMoveDown);
    console.log('stop');
  };


  // Pause 


  _pause() {
    console.log('this.pause :', this.pause);
    if (!this.pause) {
      console.log("pause active");
      this.intervalBackground = clearInterval(this.intervalBackground);
      this.interval = window.cancelAnimationFrame(this.interval);
      this.intervalLaser = clearInterval(this.intervalLaser);
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
    this._drawPlayer();
    this._drawTime();
    this._drawPoints();
    this._drawLaser();
    this._moveLaser();
    this._drawEnemies();
    this._drawEnemiesLaser();
    this._moveEnemiesLaser();
    //this._moveEnemies();
    this._gameOver();

    if (!!this.interval) {
      this.interval = window.requestAnimationFrame(this._update.bind(this));
    }
  }
}



