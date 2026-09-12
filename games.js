// Games Module
let gameState = {
    currentGame: null,
    score: 0,
    isPlaying: false,
    gameData: {}
};

// Load game based on type
function loadGame(gameName, container) {
    gameState.currentGame = gameName;
    gameState.score = 0;
    gameState.isPlaying = true;
    
    switch(gameName) {
        case 'tap':
            initTapGame(container);
            break;
        case 'memory':
            initMemoryGame(container);
            break;
        case 'snake':
            initSnakeGame(container);
            break;
        case 'flappy':
            initFlappyGame(container);
            break;
        default:
            container.innerHTML = '<p>Game not found</p>';
    }
}

// ============= TAP MASTER GAME =============
function initTapGame(container) {
    container.innerHTML = `
        <div class="tap-game">
            <div class="tap-button" id="tapButton"></div>
            <div class="tap-timer">Time: <span id="tapTime">10</span>s</div>
        </div>
    `;
    
    gameState.gameData = {
        tapCount: 0,
        timeLeft: 10,
        timerInterval: null
    };
    
    const tapButton = document.getElementById('tapButton');
    const tapTime = document.getElementById('tapTime');
    
    // Add tap listener
    tapButton.addEventListener('click', () => {
        if (gameState.isPlaying) {
            gameState.gameData.tapCount++;
            gameState.score = gameState.gameData.tapCount;
            updateGameScore();
            
            // Visual feedback
            tapButton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                tapButton.style.transform = 'scale(1)';
            }, 100);
        }
    });
    
    // Timer
    gameState.gameData.timerInterval = setInterval(() => {
        gameState.gameData.timeLeft--;
        tapTime.textContent = gameState.gameData.timeLeft;
        
        if (gameState.gameData.timeLeft <= 0) {
            endTapGame();
        }
    }, 1000);
}

function endTapGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.gameData.timerInterval);
    
    const reward = Math.floor(gameState.score * 2);
    addTokens(reward, 'tap');
    
    showNotification(`🎉 Game Over! Score: ${gameState.score} (+${reward} tokens)`);
    
    setTimeout(() => {
        closeGame();
    }, 2000);
}

// ============= MEMORY MATCH GAME =============
function initMemoryGame(container) {
    const cards = generateMemoryCards(12);
    
    container.innerHTML = `
        <div class="memory-game">
            <div class="memory-grid" id="memoryGrid"></div>
            <div class="memory-stats">
                Matches: <span id="memoryMatches">0</span>/6
            </div>
        </div>
    `;
    
    gameState.gameData = {
        cards: cards,
        flipped: [],
        matched: [],
        moves: 0
    };
    
    const grid = document.getElementById('memoryGrid');
    
    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-card';
        cardEl.dataset.index = index;
        cardEl.dataset.value = card;
        cardEl.textContent = '?';
        
        cardEl.addEventListener('click', () => flipMemoryCard(cardEl, index));
        grid.appendChild(cardEl);
    });
}

function generateMemoryCards(count) {
    const pairs = count / 2;
    const icons = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥝'];
    const cards = [];
    
    for (let i = 0; i < pairs; i++) {
        cards.push(icons[i % icons.length]);
        cards.push(icons[i % icons.length]);
    }
    
    return cards.sort(() => Math.random() - 0.5);
}

function flipMemoryCard(element, index) {
    if (!gameState.isPlaying || element.classList.contains('flipped')) return;
    
    element.classList.add('flipped');
    element.textContent = gameState.gameData.cards[index];
    gameState.gameData.flipped.push({element, index});
    
    if (gameState.gameData.flipped.length === 2) {
        gameState.gameData.moves++;
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    const [first, second] = gameState.gameData.flipped;
    const isMatch = gameState.gameData.cards[first.index] === gameState.gameData.cards[second.index];
    
    setTimeout(() => {
        if (isMatch) {
            gameState.gameData.matched.push(first.index, second.index);
            gameState.score = gameState.gameData.matched.length / 2;
            updateGameScore();
            
            document.getElementById('memoryMatches').textContent = gameState.score;
            
            if (gameState.gameData.matched.length === gameState.gameData.cards.length) {
                endMemoryGame();
            }
        } else {
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
            first.element.textContent = '?';
            second.element.textContent = '?';
        }
        gameState.gameData.flipped = [];
    }, 800);
}

function endMemoryGame() {
    gameState.isPlaying = false;
    const reward = gameState.gameData.moves * 10;
    addTokens(reward, 'memory');
    
    showNotification(`🎉 Game Over! Moves: ${gameState.gameData.moves} (+${reward} tokens)`);
    
    setTimeout(() => {
        closeGame();
    }, 2000);
}

// ============= SNAKE GAME =============
function initSnakeGame(container) {
    container.innerHTML = `
        <div class="snake-game">
            <canvas id="snakeCanvas" width="300" height="400"></canvas>
            <div class="snake-score">Score: <span id="snakeScore">0</span></div>
        </div>
    `;
    
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    
    gameState.gameData = {
        snake: [{x: 10, y: 10}],
        food: {x: 15, y: 15},
        direction: {x: 1, y: 0},
        nextDirection: {x: 1, y: 0},
        score: 0,
        gameLoopInterval: null
    };
    
    // Controls
    document.addEventListener('keydown', (e) => handleSnakeInput(e));
    
    // Touch controls
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    canvas.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        handleSnakeSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    });
    
    // Game loop
    gameState.gameData.gameLoopInterval = setInterval(() => {
        updateSnakeGame();
        drawSnakeGame(ctx, canvas);
    }, 100);
}

function handleSnakeInput(e) {
    const key = e.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') {
        if (gameState.gameData.direction.y === 0) gameState.gameData.nextDirection = {x: 0, y: -1};
    } else if (key === 'arrowdown' || key === 's') {
        if (gameState.gameData.direction.y === 0) gameState.gameData.nextDirection = {x: 0, y: 1};
    } else if (key === 'arrowleft' || key === 'a') {
        if (gameState.gameData.direction.x === 0) gameState.gameData.nextDirection = {x: -1, y: 0};
    } else if (key === 'arrowright' || key === 'd') {
        if (gameState.gameData.direction.x === 0) gameState.gameData.nextDirection = {x: 1, y: 0};
    }
}

function handleSnakeSwipe(startX, startY, endX, endY) {
    const diffX = endX - startX;
    const diffY = endY - startY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && gameState.gameData.direction.x === 0) {
            gameState.gameData.nextDirection = {x: 1, y: 0};
        } else if (diffX < 0 && gameState.gameData.direction.x === 0) {
            gameState.gameData.nextDirection = {x: -1, y: 0};
        }
    } else {
        if (diffY > 0 && gameState.gameData.direction.y === 0) {
            gameState.gameData.nextDirection = {x: 0, y: 1};
        } else if (diffY < 0 && gameState.gameData.direction.y === 0) {
            gameState.gameData.nextDirection = {x: 0, y: -1};
        }
    }
}

function updateSnakeGame() {
    const snake = gameState.gameData.snake;
    gameState.gameData.direction = gameState.gameData.nextDirection;
    
    const head = {x: snake[0].x + gameState.gameData.direction.x, y: snake[0].y + gameState.gameData.direction.y};
    
    // Check collisions
    if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 40) {
        endSnakeGame();
        return;
    }
    
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endSnakeGame();
            return;
        }
    }
    
    snake.unshift(head);
    
    // Check food
    if (head.x === gameState.gameData.food.x && head.y === gameState.gameData.food.y) {
        gameState.gameData.score += 10;
        gameState.score = gameState.gameData.score;
        updateGameScore();
        document.getElementById('snakeScore').textContent = gameState.score;
        
        gameState.gameData.food = {
            x: Math.floor(Math.random() * 30),
            y: Math.floor(Math.random() * 40)
        };
    } else {
        snake.pop();
    }
}

function drawSnakeGame(ctx, canvas) {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#4CAF50';
    gameState.gameData.snake.forEach((segment, index) => {
        const x = segment.x * 10;
        const y = segment.y * 10;
        ctx.fillRect(x + 1, y + 1, 8, 8);
        if (index === 0) {
            ctx.fillStyle = '#66BB6A';
        }
    });
    
    // Draw food
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(gameState.gameData.food.x * 10 + 1, gameState.gameData.food.y * 10 + 1, 8, 8);
}

function endSnakeGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.gameData.gameLoopInterval);
    
    const reward = gameState.score * 5;
    addTokens(reward, 'snake');
    
    showNotification(`🎉 Game Over! Score: ${gameState.score} (+${reward} tokens)`);
    
    setTimeout(() => {
        closeGame();
    }, 2000);
}

// ============= FLAPPY WINGS GAME =============
function initFlappyGame(container) {
    container.innerHTML = `
        <div class="flappy-game">
            <canvas id="flappyCanvas" width="300" height="400"></canvas>
            <div class="flappy-score">Score: <span id="flappyScore">0</span></div>
        </div>
    `;
    
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    
    gameState.gameData = {
        bird: {x: 50, y: 150, width: 20, height: 20, velocity: 0},
        pipes: [],
        score: 0,
        gravity: 0.4,
        gameLoopInterval: null,
        pipeCounter: 0
    };
    
    // Click to flap
    document.addEventListener('click', () => {
        if (gameState.isPlaying) {
            gameState.gameData.bird.velocity = -8;
        }
    });
    
    // Tap to flap
    document.addEventListener('touchstart', () => {
        if (gameState.isPlaying) {
            gameState.gameData.bird.velocity = -8;
        }
    });
    
    // Game loop
    gameState.gameData.gameLoopInterval = setInterval(() => {
        updateFlappyGame();
        drawFlappyGame(ctx, canvas);
    }, 30);
}

function updateFlappyGame() {
    const bird = gameState.gameData.bird;
    
    // Physics
    bird.velocity += gameState.gameData.gravity;
    bird.y += bird.velocity;
    
    // Boundaries
    if (bird.y + bird.height > 400) {
        endFlappyGame();
        return;
    }
    
    if (bird.y < 0) {
        bird.y = 0;
    }
    
    // Pipes
    gameState.gameData.pipeCounter++;
    if (gameState.gameData.pipeCounter > 90) {
        gameState.gameData.pipes.push({x: 300, y: Math.random() * 150 + 50});
        gameState.gameData.pipeCounter = 0;
    }
    
    gameState.gameData.pipes = gameState.gameData.pipes.filter(pipe => {
        pipe.x -= 4;
        
        // Collision
        if (pipe.x < bird.x + bird.width && pipe.x + 60 > bird.x) {
            if (bird.y < pipe.y || bird.y + bird.height > pipe.y + 120) {
                endFlappyGame();
                return false;
            }
        }
        
        // Score
        if (pipe.x === bird.x) {
            gameState.gameData.score += 10;
            gameState.score = gameState.gameData.score;
            updateGameScore();
            document.getElementById('flappyScore').textContent = gameState.score;
        }
        
        return pipe.x > -80;
    });
}

function drawFlappyGame(ctx, canvas) {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(gameState.gameData.bird.x, gameState.gameData.bird.y, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pipes
    ctx.fillStyle = '#4CAF50';
    gameState.gameData.pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 60, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + 120, 60, canvas.height - pipe.y - 120);
    });
}

function endFlappyGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.gameData.gameLoopInterval);
    
    const reward = gameState.score * 3;
    addTokens(reward, 'flappy');
    
    showNotification(`🎉 Game Over! Score: ${gameState.score} (+${reward} tokens)`);
    
    setTimeout(() => {
        closeGame();
    }, 2000);
}

// Update game score display
function updateGameScore() {
    const scoreEl = document.getElementById('gameScore');
    if (scoreEl) {
        scoreEl.textContent = gameState.score;
    }
}

// Export
window.loadGame = loadGame;
window.gameState = gameState;
