
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const resetButton = document.getElementById('resetButton');


let score = 0;
let gameOver = false;
let gameSpeed = 1;
let isDifficultyIncreased = false;


const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    size: 40,
    speed: 7,
    boostSpeed: 14,
    currentSpeed: 7,
    isMovingLeft: false,
    isMovingRight: false
};


const bullets = [];
const bulletSpeed = 15;
const bulletSize = 5;
let canShoot = true;
const shootCooldown = 80;


const asteroids = [];
let asteroidSpeed = 2;
let spawnRate = 60;


function drawPlayer() {
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();


    ctx.moveTo(player.x, player.y - player.size * 0.5);
    ctx.lineTo(player.x - player.size * 0.2, player.y + player.size * 0.2);
    ctx.lineTo(player.x - player.size * 0.4, player.y + player.size * 0.2);
    ctx.lineTo(player.x - player.size * 0.2, player.y + player.size * 0.5);
    ctx.lineTo(player.x + player.size * 0.2, player.y + player.size * 0.5);
    ctx.lineTo(player.x + player.size * 0.4, player.y + player.size * 0.2);
    ctx.lineTo(player.x + player.size * 0.2, player.y + player.size * 0.2);

    ctx.closePath();
    ctx.fill();
}

function drawAimline() {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x, 0);
    ctx.stroke();
}

function drawBullets() {
    ctx.fillStyle = '#00ffff';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bulletSize, bulletSize * 4);
    });
}

function drawAsteroids() {
    ctx.fillStyle = '#ff00ff';
    asteroids.forEach(asteroid => {
        ctx.beginPath();

        const numPoints = Math.floor(Math.random() * 5) + 5;
        const angleStep = (Math.PI * 2) / numPoints;

        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleStep;
            const x = asteroid.x + Math.cos(angle) * asteroid.size;
            const y = asteroid.y + Math.sin(angle) * asteroid.size;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
    });
}


function update() {
    if (gameOver) {
        return;
    }


    if (player.isMovingLeft && player.x > 0) {
        player.x -= player.currentSpeed;
    }
    if (player.isMovingRight && player.x < canvas.width) {
        player.x += player.currentSpeed;
    }


    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bulletSpeed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }


    if (Math.random() < 1 / spawnRate) {
        asteroids.push({
            x: Math.random() * canvas.width,
            y: -20,
            size: 15 + Math.random() * 20,
            speed: asteroidSpeed
        });
    }


    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].y += asteroids[i].speed * gameSpeed;


        for (let j = bullets.length - 1; j >= 0; j--) {
            const distance = Math.hypot(bullets[j].x - asteroids[i].x, bullets[j].y - asteroids[i].y);
            if (distance < asteroids[i].size) {
                score += 10;
                scoreDisplay.textContent = `Punkte: ${score}`;
                asteroids.splice(i, 1);
                bullets.splice(j, 1);
                break;
            }
        }


        if (asteroids.length > 0 && asteroids[i].y > canvas.height) {
            endGame();
            return;
        }


        if (asteroids[i] && asteroids[i].y > canvas.height + 50) {
            asteroids.splice(i, 1);
        }
    }


    if (score > 0 && score % 100 === 0 && !isDifficultyIncreased) {
        gameSpeed += 0.1;
        if (spawnRate > 10) {
            spawnRate -= 5;
        }
        isDifficultyIncreased = true;
    } else if (score % 100 !== 0) {
        isDifficultyIncreased = false;
    }


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawAimline();
    drawBullets();
    drawAsteroids();
}

function endGame() {
    gameOver = true;
    ctx.fillStyle = '#ff0000';
    ctx.font = '40px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Deine Punkte: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
    resetButton.style.display = 'block';
}

function resetGame() {
    score = 0;
    gameOver = false;
    gameSpeed = 1;
    isDifficultyIncreased = false;
    player.x = canvas.width / 2;
    bullets.length = 0;
    asteroids.length = 0;

    scoreDisplay.textContent = `Punkte: ${score}`;
    resetButton.style.display = 'none';
}


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        player.isMovingLeft = true;
    }
    if (e.key === 'ArrowRight') {
        player.isMovingRight = true;
    }
    if (e.key === 'Shift') {
        player.currentSpeed = player.boostSpeed;
    }
    if (e.key === ' ' && !gameOver && canShoot) {
        bullets.push({
            x: player.x,
            y: player.y - player.size / 2
        });
        canShoot = false;
        setTimeout(() => {
            canShoot = true;
        }, shootCooldown);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        player.isMovingLeft = false;
    }
    if (e.key === 'ArrowRight') {
        player.isMovingRight = false;
    }
    if (e.key === 'Shift') {
        player.currentSpeed = player.speed;
    }
});

resetButton.addEventListener('click', resetGame);


setInterval(update, 1000 / 60);