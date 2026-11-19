const gameboard = document.querySelector('.gameboard');
const frog = document.querySelector('.frog');
const startBtn = document.querySelector('.start-button');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const river = document.querySelector('.lazy-river');
const cars = document.querySelectorAll('.car, .car-two');
const logs = document.querySelectorAll('.log');

const STEP = 50; // Height of each row
const BOARD_WIDTH = 920;
const BOARD_HEIGHT = 800;
const START_X = 418;
const START_Y = 715;

let frogX = START_X;
let frogY = START_Y;
let highestY = START_Y; // Tracks highest row reached on current life
let score = 0;
let lives = 3;
let isPlaying = false;
let gameLoopId = null;

// Helper to update score in one place
function addScore(points) {
  score += points;
  scoreEl.textContent = score;
}

// Position the frog visually
function updateFrogPosition() {
  frog.style.left = frogX + 'px';
  frog.style.top = frogY + 'px';
}

// Reset frog to start line
function resetFrog() {
  frogX = START_X;
  frogY = START_Y;
  highestY = START_Y; // Reset progress tracker for the new run
  updateFrogPosition();
}

// Start or Restart Game
startBtn.addEventListener('click', () => {
  score = 0;
  lives = 3;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  isPlaying = true;
  gameboard.classList.add('playing');
  startBtn.textContent = 'RESTART GAME';
  resetFrog();
  
  if (gameLoopId) cancelAnimationFrame(gameLoopId);
  gameLoop();
});

// Arrow Key Controls
document.addEventListener('keydown', (e) => {
  if (!isPlaying) return;

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  switch (e.key) {
    case 'ArrowUp':
      if (frogY - STEP >= 0) {
        frogY -= STEP;
        // Award 10 points only when reaching a new highest row
        if (frogY < highestY) {
          highestY = frogY;
          addScore(10);
        }
      }
      break;
    case 'ArrowDown':
      if (frogY + STEP < BOARD_HEIGHT) frogY += STEP;
      break;
    case 'ArrowLeft':
      if (frogX - STEP >= 0) frogX -= STEP;
      break;
    case 'ArrowRight':
      if (frogX + STEP <= BOARD_WIDTH - 44) frogX += STEP;
      break;
  }
  
  updateFrogPosition();

  // Check Win Condition immediately upon moving up
  if (frogY < 50) {
    addScore(100);
    resetFrog();
  }
});

function isColliding(rect1, rect2, padding = 2) {
  return !(
    rect1.right - padding < rect2.left + padding ||
    rect1.left + padding > rect2.right - padding ||
    rect1.bottom - padding < rect2.top + padding ||
    rect1.top + padding > rect2.bottom - padding
  );
}

function loseLife() {
  lives--;
  livesEl.textContent = lives;
  if (lives <= 0) {
    isPlaying = false;
    gameboard.classList.remove('playing');
    alert('Game Over! Final Score: ' + score);
  } else {
    resetFrog();
  }
}

// Main Collision Detection Loop
function gameLoop() {
  if (!isPlaying) return;

  const frogRect = frog.getBoundingClientRect();
  const riverRect = river.getBoundingClientRect();

  // 1. Check Car Collisions
  for (let car of cars) {
    if (isColliding(frogRect, car.getBoundingClientRect(), 8)) {
      loseLife();
      break;
    }
  }

  // 2. Check River & Log Collisions
  const frogCenterY = frogRect.top + frogRect.height / 2;
  if (isPlaying && frogCenterY > riverRect.top && frogCenterY < riverRect.bottom) {
    let onLog = false;
    for (let log of logs) {
      if (isColliding(frogRect, log.getBoundingClientRect(), 2)) {
        onLog = true;
        break;
      }
    }

    if (!onLog) {
      loseLife();
    }
  }

  if (isPlaying) {
    gameLoopId = requestAnimationFrame(gameLoop);
  }
}
