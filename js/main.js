let ctx;
let game;

document.addEventListener('DOMContentLoaded', (event) => {
  let canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  game = new Game({ctx}, 
    new Player(80,80,200,500),
    new Background(886,3130,0,0), 
    canvas.width-100, 
    canvas.height);

  
    function start(){
      canvas.style = "display:block";
      game.start();

      const startButton = document.getElementById("start");
      startButton.style = "display: none";
      const startImage = document.getElementById("img-start")
      startImage.style = "display: none";
      const time = document.getElementById("time");
      time.style = "display: block";
      const containerPoints = document.getElementById("container-points");
      containerPoints.style = "display: block";
      const points = document.getElementById("points");
      points.style = "display: block";
      const containerImage = document.getElementById("image-container");
      containerImage.style = "display:block;";
    }

    function restart(){
      canvas.style = "display:block";

        game = new Game({ctx}, 
          new Player(80,80,250,500),
          new Background(886,3130,0,0), 
          canvas.width-100, 
          canvas.height);
      
      game.start();

      gameOver.style = "display:none";
      gameOverTitle.style = "display:none";
      time.style = "display:block";
      points.style = "display:block";
      const containerImage = document.getElementById("image-container");
      containerImage.style = "display:block;";
      const containerPoints = document.getElementById("container-points");
      containerPoints.style = "display:block;";


    }
    
    

    const startButton = document.getElementById("start");
    startButton.addEventListener("click", start);

    // Restart 

    const tryAgain = document.getElementById("tryAgain");
    tryAgain.addEventListener("click", restart);

});