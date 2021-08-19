console.log("working");
window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  function startGame() {}
};

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", () => {
  document.querySelector("#game-board").style.display = "block";
  game.start();
});

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let interval;

const game = {
  frames: 0,
  obstacles: [],
  start: () => {
    interval = setInterval(() => {
      updateCanvas();
    }, 10);
  },
  stop: () => {
    clearInterval(interval);
  },
  clear: () => {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  },
  score: () => {
    const points = Math.floor(game.frames / 5);
    context.font = "30px Arial";
    context.fillStyle = "black";
    context.fillText(`Score: ${points}`, 185, 50);
  },
};


class Car {
  constructor(x, y){
      this.x = x;
      this.y = y;

      const image = new Image();
      image.src = "./images/car.png";
      image.onload = () => {
          this.image = image;
          this.draw();
      }
  }

  draw(){
      context.drawImage(this.image, this.x, this.y, 50, 80);
  }

  moveRight(){
      this.x += 10;
  }

  moveLeft(){
      this.x -= 10;
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }
}

const player = new Car(225, 575);


document.addEventListener("keydown", (e) => {
  switch(e.key){
      case "ArrowRight":
          player.moveRight();
          break;

      case "ArrowLeft":
          player.moveLeft();
          break;
  }
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  player.draw();
});



class Component {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }

  crashWith(car) {
    return !(
      this.bottom() < car.top() ||
      this.top() > car.bottom() ||
      this.right() < car.left() ||
      this.left() > car.right()
    );
  }
}


function drawObstacles() {
  game.obstacles.forEach((obstacle) => {
    obstacle.y += 1;
    obstacle.draw();
  });

  game.frames++;

  if (game.frames % 240 === 0) {
    const minWidth = 50;
    const maxWidth = 250;
    const randomWidth = Math.floor(
      Math.random() * (maxWidth - minWidth + 1) + minWidth
    );

    const minGap = 55;
    const maxGap = 120;
    const randomGap = Math.floor(
      Math.random() * (maxGap - minGap + 1) + minGap
    );

    const obstacleLeft = new Component(
      0,
      0,
      randomWidth,
      20,
      "red"
    );

    game.obstacles.push(obstacleLeft);

    const obstacleRight = new Component(
      randomWidth + randomGap,
      0,
      canvas.clientWidth - (randomWidth + randomGap),
      20,
      "red"
    );

    game.obstacles.push(obstacleRight);
    }
}

function checkGameOver() {
  const crashed = game.obstacles.some((obstacle) => {
    return obstacle.crashWith(player) === true;
  });

  if (crashed) {
      game.stop();
  }
}

function updateCanvas() {
  game.clear();
  player.draw();
  drawObstacles();
  game.score();
  checkGameOver();
}
