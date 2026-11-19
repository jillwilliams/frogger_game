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

let frogX = 278;
let frogY = 428;
let score = 0;
let lives = 3;
let isPlaying = false;
let gameLoopId = null;

// Position the frog visually
function updateFrogPosition() {
    frog.style.left = frogX + 'px';
    frog.style.top = frogY + 'px';
}

// Reset frog to start line
function resetFrog() {
    frogX = 418;
    frogY = 715;
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
    e.preventDefault(); // Prevent page scrolling
    }
    switch (e.key) {
        case 'ArrowUp':
        if (frogY - STEP >= 0) frogY -= STEP;
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
});


// Helper for bounding box collisions
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
}}


// Main Collision & Win Detection Loop
function gameLoop() {
    if (!isPlaying) return;
    const frogRect = frog.getBoundingClientRect();
    const riverRect = river.getBoundingClientRect();
    // 1. Check Win Condition (Reached Home Base at top)
    if (frogY < 50) {
        score += 100;
        lives++;
        scoreEl.textContent = score;
    resetFrog();
}


// 2. Check Car Collisions
for (let car of cars) {
    if (isColliding(frogRect, car.getBoundingClientRect(), 8)) {
    loseLife();
    break;
    }
}


// 3. Check River & Log Collisions
// If the frog's vertical center is inside the river
const frogCenterY = frogRect.top + frogRect.height / 2;
    if (frogCenterY > riverRect.top && frogCenterY < riverRect.bottom) {
        let onLog = false;
        for (let log of logs) {
        if (isColliding(frogRect, log.getBoundingClientRect(), 2)) {
        onLog = true;
        break;
    }
}

// Drown if in the river and not on a log
    if (!onLog) {
        loseLife();
    }
}
gameLoopId = requestAnimationFrame(gameLoop);
}