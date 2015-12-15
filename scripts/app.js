
var canvas;//HTML5 canvas element
var canvasContext;//Context to go with canvas
var ballX = 50;
var ballY = 50;
var ballSpeedX = 6;
var ballSpeedY = 3;

var playerY = 250;

var opponentY = 250;

var radius = 11;
const PADDLE_OFFSET_X = 2;
const PADDLE_WIDTH = 5;
const PADDLE_HEIGHT = 100;
var canvasOrigin = 0;

const WINNING_SCORE = 3;

var playerScore = 0;
var opponentScore = 0;

var showWinScreen = false;

function mouseXY(event) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = event.clientX - rect.left - root.scrollLeft;
  var mouseY = event.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handleMouseClick(event) {
  if (showWinScreen) {
    playerScore = 0;
    opponentScore = 0;
    showWinScreen = false;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');//Set our canvas
  canvasContext = canvas.getContext('2d');//Set our canvasContext

  var fps = 40;//frames per second
  var second = 1000;//milliseconds
  setInterval(function() {
    moveEverything();//Take care of movement every time that draw() is called
    drawEverything();//Draw all elements of the game board
  }, second / fps);//Also include our framerate, how often to refresh

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove',
  function(event) {
    var mousePos = mouseXY(event);
    playerY = mousePos.y - (PADDLE_HEIGHT / 2);
  });
};

function drawNet() {
  for (var i = 10; i < canvas.height; i += 40) {
    canvasContext.fillStyle = 'white';//Fill background of screen

    canvasContext.fillRect(canvas.width / 2 - 1, i, 2, 20);
  }
}

function drawEverything() {
  canvasContext.fillStyle = 'black';//Fill background of screen

  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  canvasContext.fillStyle = 'white';//Set color for game elements

  if (showWinScreen) {
    if (playerScore >= WINNING_SCORE) {
      canvasContext.fillText('YOU WIN!', 2 * canvas.width / 5, canvas.height / 2);
      canvasContext.fillText('click to continue', 2 * canvas.width / 5, canvas.height - 50);
    } else if (opponentScore >= WINNING_SCORE) {
      canvasContext.fillText('YOU LOSE.', 2 * canvas.width / 5, canvas.height / 2);
      canvasContext.fillText('click to continue', 2 * canvas.width / 5, canvas.height - 50);
    }

    return;
  }

  drawNet();//Draw the net for gameplay

  canvasContext.fillStyle = 'white';//Set color for game elements

  canvasContext.fillRect(PADDLE_OFFSET_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);//Player paddle

  drawCircle(ballX, ballY, radius, 'white');//the ball
  // canvasContext.fillRect(ballX, 300, 40, 40);

  canvasContext.fillRect(canvas.width - PADDLE_OFFSET_X - PADDLE_WIDTH, opponentY, PADDLE_WIDTH, PADDLE_HEIGHT);

  canvasContext.fillText(playerScore, 150, 50);
  canvasContext.fillText(opponentScore, canvas.width - 150, 50);
};

function drawCircle(originX, originY, circleRadius, color) {
  canvasContext.fillStyle = color;//Set color for game elements
  canvasContext.beginPath();
  canvasContext.arc(originX, originY, circleRadius - 1, 0, Math.PI * 2, true);
  canvasContext.fill();
};

function ballReset() {
  if (playerScore >= WINNING_SCORE || opponentScore >= WINNING_SCORE) {
    showWinScreen = true;
  }

  ballSpeedY = 4;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedY = -ballSpeedY;//Change direction
}

function computerMovement() {
  if (opponentY + (PADDLE_HEIGHT / 2) < ballY - 35) {
    opponentY += 6;
  } else if (opponentY + (PADDLE_HEIGHT / 2) > ballY + 35) {
    opponentY -= 6;
  }
}

function moveEverything() {

  computerMovement();
  ballX += ballSpeedX;//Move the ball in the X direction
  //Check if we are on the edge of the canvas, and if so, change direction
  if (ballX - PADDLE_OFFSET_X - radius < canvasOrigin) {
    if (ballY > playerY && ballY < playerY + PADDLE_HEIGHT) {
      var deltaY = ballY - playerY - (PADDLE_HEIGHT / 2);

      ballSpeedY = deltaY * .25;

      ballSpeedX = -ballSpeedX;//Change direction
    } else {
      opponentScore++;
      ballReset();
    }
  } else if (ballX + radius + PADDLE_OFFSET_X > canvas.width) {
    if (ballY > opponentY && ballY < opponentY + PADDLE_HEIGHT) {
      var deltaY = ballY - opponentY - (PADDLE_HEIGHT / 2);

      ballSpeedY = deltaY * .25;

      ballSpeedX = -ballSpeedX;//Change direction
    } else {
      playerScore++;
      ballReset();
    }
  }

  ballY += ballSpeedY;//Move the ball in the Y direction
  //Check if we are on the edge of the canvas, and if so, change direction
  if (ballY + radius >= canvas.height || ballY - radius <= canvasOrigin) {
    ballSpeedY = -ballSpeedY;//Change direction
  }
};
