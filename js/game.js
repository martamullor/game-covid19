class Game {
  constructor(options, player, canvasWidth, canvasHeight) {
    this.ctx = options.ctx;
    this.player = player;
    this.interval = undefined;
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
    this.laser = [];
    this.enemies = [];
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
          //this.player.movement.play();
          this.player.moveLeft();
          if (this.player.x < 0) {
            this.player.x = 0;
          }
          break;
        case 39: // arrow right
          console.log("right");
          //this.player.movement.play();
          this.player.moveRight();
          if (this.player.x > this.canvasWidth) {
            this.player.x = this.canvasWidth;
          }
          break;
        case 32: // space 
          this._generateLaser()
          console.log(this.laser)
          //this.pause = !this.pause;
          break;
      }
    });
  }


  _collidesWithObstacle() {
    this.obstacle.forEach((element, position) => {
      if (element.y + element.height >= this.canvasHeight - this.player.height &&
        (
          (element.x + element.width >= this.player.x &&
            element.x + element.width <= this.player.x + this.player.width)
          ||
          (this.player.x + this.player.height >= element.x &&
            this.player.x + this.player.height <= element.x + element.width)
        )) {
        if (element.type === "enemy") {
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


  /* Laser */

  _drawLaser() {
    this.laser.forEach(element => {
      this.laser.image = new Image();
      this.laser.image.src = "./img/covid.png";
      this.ctx.drawImage(this.laser.image, element.x, element.y, element.width, element.height);
    })
  }

  _generateLaser() {
    this.laser.push(new Laser(60, 60, this.player.x, this.player.y));
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
      this.enemies.image = new Image();
      this.enemies.image.src = "./img/women-mask.png";
      this.ctx.drawImage(this.enemies.image, element.x, element.y, element.width, element.height);
    })
  }

  _generateEnemies() {
    for (let i = 0; i < 10; i++) {
      this.enemies.push(new Enemies(60, 60, 80 + (i*70), 150));
    }
  };

  _getRandomNumber(max){
    return Math.floor(Math.random() * (max - 0)) + 0;  
  };

  // BUCLES 

  start() {
    this._assignControlsToKeys();
    this._generateEnemies(100, 400);
    this.interval = window.requestAnimationFrame(this._update.bind(this));
  };


  // Limpiado

  _clear() {
    this.ctx.clearRect(0, 0, 886, 600);
  };

  // Stop All

  _stop() {
    console.log('stop');
    this.interval = clearInterval(this.interval);
    this.intervalBackground = clearInterval(this.intervalBackground);
    this.intervalLaser = clearInterval(this.intervalLaser);
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
    this._gameOver();

    if (!!this.interval) {
      this.interval = window.requestAnimationFrame(this._update.bind(this));
    }
  }
}



