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
    this.laser = [];
    this.enemies = [];
    this.enemiesLaser = [];
    this.intervalEnemiesLaser = undefined;
    this.intervalEnemiesMoveDown = undefined;
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
          this.player.moveLeft();
          if (this.player.x < 0) {
            this.player.x = 0;
          }
          break;
        case 39: // arrow right
          this.player.moveRight();
          console.log(this.canvasWidth);
          if (this.player.x > this.canvasWidth + 50) {
            this.player.x = this.canvasWidth + 50 ;
          }
          break;
        case 32: // barra espaciadora Laser 
          this._generateLaser();
          break;
      }
    });
  }

  /* Laser */

  _drawLaser() {
    this.laser.forEach(element => {
      this.laser.image = new Image();
      this.laser.image.src = "./img/goodShot.png";
      this.ctx.drawImage(this.laser.image, element.x, element.y, element.width, element.height);
    })
  }

  _generateLaser() {
    this.laser.push(new Laser(30, 30, this.player.x, this.player.y));
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
        console.log('Laser deleted')
        this.laser.shift();
      }
    })
  };


  /* ENEMIES */


  _generateEnemies() {
    for (let i = 0; i < 10; i++) {
      this.enemies.push(new Enemy(40, 40, 80 + (i * 70), 80, 'bat'));
      this.enemies.push(new Enemy(40, 40, 80 + (i * 70), 140, 'bat'));
      this.enemies.push(new Enemy(45, 45, 80 + (i * 70), 220, 'virus'));
      this.enemies.push(new Enemy(45, 45, 80 + (i * 70), 290, 'virus'));
    }
  };

  _moveDownEnemies() {
    this.intervalEnemiesMoveDown = setInterval(() => {
      for (let i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i].type === 'bat') {
          this.enemies[i].y += 1;
          this._deleteEnemies();
        } else if (this.enemies[i].type === 'virus') {
          this.enemies[i].y += 1;
          this._deleteEnemies();
        }
      }
    }, 1000);
  };

  _deleteEnemies() {
    this.enemies.forEach((element) => {
      if (element.y + element.height === this.canvasHeight) {
        console.log('enemy deleted')
        this.enemies.shift();
      }
    })
  }

  _drawEnemies() {
    this.enemies.forEach(element => {
      if (element.type === "bat") {
        this.enemies.image = new Image();
        this.enemies.image.src = "./img/angrybat.png";
        this.ctx.drawImage(this.enemies.image, element.x, element.y, element.width, element.height);
      } else if (element.type === "virus") {
        this.enemies.image = new Image();
        this.enemies.image.src = "./img/angryvirus.png";
        this.ctx.drawImage(this.enemies.image, element.x, element.y, element.width, element.height);
      }
    });
  }

  /* ENEMIES LASER */

  _drawEnemiesLaser() {
    this.enemiesLaser.forEach(element => {
      this.enemiesLaser.image = new Image();
      this.enemiesLaser.image.src = "./img/badshot.png";
      this.ctx.drawImage(this.enemiesLaser.image, element.x, element.y, element.width, element.height);
    })
  }

  _generateEnemiesLaser() {
    this.intervalEnemiesLaser = setInterval(() => {
      this.enemiesLaser.push(new EnemiesLaser(25, 25, this._getRandomIntInclusive(20, 700), this.enemies[this._getRandomIntInclusive(0, 10)].y));
    }, 2000);
  };

  _moveEnemiesLaser() {
    for (let i = 0; i < this.enemiesLaser.length; i++) {
      this.enemiesLaser[i].y += 2;
      this._deleteEnemiesLaser();
      this._collidesWithLaserEnemies();
    }
  };

  _collidesWithLaserEnemies() {
    this.enemiesLaser.forEach((element, position) => {
      if (element.y + element.height >= this.canvasHeight - this.player.height &&
        (
          (element.x + element.width >= this.player.x &&
            element.x + element.width <= this.player.x + this.player.width)
          ||
          (this.player.x + this.player.height >= element.x &&
            this.player.x + this.player.height <= element.x + element.width)
        )) {
        this._stop()
      }
    });
  };


  _deleteEnemiesLaser() {
    this.enemiesLaser.forEach((element) => {
      if (element.y + element.height === this.canvasHeight) {
        console.log('enemies laser deleted')
        this.enemiesLaser.shift();
      }
    })
  }


  /* HELPER FUNCTIONS */

  _getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  // BUCLES 

  start() {
    this._assignControlsToKeys();
    console.log('Canvas width', this.canvasWidth);
    this._generateEnemies();
    this._generateEnemiesLaser();
    this._moveDownEnemies();
    console.log('2.Canvas width', this.canvasWidth);
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


  // Update function

  _update() {

    this._clear();
    this._drawPlayer();
    this._drawLaser();
    this._moveLaser();
    this._drawEnemies();
    this._drawEnemiesLaser();
    this._moveEnemiesLaser();

    if (!!this.interval) {
      this.interval = window.requestAnimationFrame(this._update.bind(this));
    }
  }
}



