
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
    this.image.src = "./img/women-mask.png";
  }

  moveRight(){
    this.x += 20;
  }

  moveLeft(){
    this.x -= 20;
  }
}