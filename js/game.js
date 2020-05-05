class Game {
  constructor(options, player, canvasWidth, canvasHeight) {
    this.ctx = options.ctx;
    this.player = player;
    this.interval = undefined;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
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
          if (this.player.x > this.canvasWidth + 50) {
            this.player.x = this.canvasWidth + 50;
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
    this.laser.push(new Laser(25, 25, this.player.x + 10, this.player.y));
  };


  _moveLaser() {
    for (let i = 0; i < this.laser.length; i++) {
      this.laser[i].y -= 10;
      this._collidesLaser();
      this._deleteLaser();
    }
  };

  _deleteLaser() {
    this.laser.forEach((element) => {
      if (element.y === 0) {
        console.log('Laser deleted')
        this.laser.shift();
      }
    })
  };

  _collidesLaser() {
    this.enemies.forEach((enemies, position) => {
      this.laser.forEach((laser) => {
        if (laser.x >= (enemies.x - enemies.width / 2) && laser.x <= (enemies.x + enemies.width / 2) &&
          laser.y >= (enemies.y - enemies.height / 2) && laser.y <= (enemies.y + enemies.height / 2)) {
          // Cambiar a Game Over 
          this.laser.shift();
          this.enemies.splice(position, 1);
        }
      });
    });
  };




  /* ENEMIES */


  _generateEnemies() {
    for (let i = 0; i < 10; i++) {
      this.enemies.push(new Enemy(40, 40, 100 + (i * 50), 80, 'bat'));
      this.enemies.push(new Enemy(40, 40, 100 + (i * 50), 130, 'bat'));
      this.enemies.push(new Enemy(45, 45, 100 + (i * 50), 180, 'virus'));
      this.enemies.push(new Enemy(45, 45, 100 + (i * 50), 230, 'virus'));
    }
  };

  _moveDownEnemies() {
    this.intervalEnemiesMoveDown = setInterval(() => {
      for (let i = 0; i < this.enemies.length; i++) {
        this.enemies[i].y += 50;
        this._collidesEnemies();
      }
    }, 1000);
  };


  _collidesEnemies() {
    this.enemies.forEach((enemies, position) => {
      if((enemies.x + enemies.width/2) > (this.player.x - this.player.width/2) && 
      (enemies.x - enemies.width/2) < (this.player.x + this.player.width/2) &&
      (enemies.y + enemies.height/2) > (this.player.y - this.player.height/2) &&
      (enemies.y - enemies.height/2) < (this.player.y + this.player.height/2)) {
        // Cambiar a Game Over 
        this._stop();
      }
    });
  };

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
      this.enemiesLaser.push(new EnemiesLaser(25, 25, this._getRandomIntInclusive(20, 500), this.enemies[this._getRandomIntInclusive(0, 10)].y));
    }, 500);
  };


  _moveEnemiesLaser() {
    for (let i = 0; i < this.enemiesLaser.length; i++) {
      this.enemiesLaser[i].y += 6;
      this._deleteEnemiesLaser();
      this._collidesWithLaserEnemies();
    }
  };


  _collidesWithLaserEnemies() {
    this.enemiesLaser.forEach((enemiesLaser, position) => {
      if (enemiesLaser.x >= (this.player.x - this.player.width / 2) && enemiesLaser.x <= (this.player.x + this.player.width / 2) &&
        enemiesLaser.y >= (this.player.y - this.player.height / 2) && enemiesLaser.y <= (this.player.y + this.player.height / 2)) {
        // Cambiar a Game Over 
        console.log('se ha parado')
        this._stop();
      }
    });
  };


  _deleteEnemiesLaser() {
    this.enemiesLaser.forEach((element) => {
      if (element.y + element.height === this.canvasHeight) {
        console.log('Laser Enemies deleted');
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



