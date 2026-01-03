const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;

const scoreDisplay = document.getElementById('scoreDisplay');
const scoreValue = scoreDisplay.querySelector('.score-value');
const comboDisplay = document.getElementById('comboDisplay');
const comboValue = document.getElementById('comboValue');
const healthBar = document.getElementById('healthBar');
const gameOverScreen = document.getElementById('gameOverScreen');
const resetButton = document.getElementById('resetButton');
const finalScoreDisplay = document.getElementById('finalScore');
const asteroidsDestroyedDisplay = document.getElementById('asteroidsDestroyed');
const accuracyDisplay = document.getElementById('accuracy');

// Game state
let score = 0;
let gameOver = false;
let gameSpeed = 1;
let isDifficultyIncreased = false;
let comboCounter = 0;
let comboTimeout;
let health = 100;
let maxHealth = 100;
let bullets_shot = 0;
let asteroids_destroyed = 0;
let frameCount = 0;

// Player
const player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    size: 30,
    speed: 6,
    boostSpeed: 11,
    currentSpeed: 6,
    isMovingLeft: false,
    isMovingRight: false,
    isBoostActive: false,
    angle: 0,
    particles: []
};

// Bullets
const bullets = [];
const bulletSpeed = 12;
const bulletSize = 4;
let canShoot = true;
const shootCooldown = 60;

// Asteroids
const asteroids = [];
let asteroidSpeed = 2;
let spawnRate = 80;

// Particles system mit Object Pool
const particles = [];
const particlePool = [];
const MAX_PARTICLES = 200;

function getParticle(x, y, vx, vy, color, life) {
    let particle;
    if (particlePool.length > 0) {
        particle = particlePool.pop();
        particle.x = x;
        particle.y = y;
        particle.vx = vx;
        particle.vy = vy;
        particle.color = color;
        particle.life = life;
        particle.maxLife = life;
    } else {
        particle = new Particle(x, y, vx, vy, color, life);
    }
    if (particles.length < MAX_PARTICLES) {
        particles.push(particle);
    }
    return particle;
}

class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life--;
    }

    draw(ctx) {
        const opacity = this.life / this.maxLife;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}

class PlayerThrust {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 4 + Math.random() * 2;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = Math.random() * 2 + 1;
        this.life = 30;
        this.maxLife = 30;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw(ctx) {
        const opacity = this.life / this.maxLife;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Drawing functions
function drawPlayer() {
    const x = player.x;
    const y = player.y;
    const size = player.size;

    // Main body glow (vereinfacht)
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
    ctx.fillRect(x - size * 1.5, y - size * 1.5, size * 3, size * 3);
    ctx.globalAlpha = 1;

    // Outer ring
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - size, y - size, size * 2, size * 2);

    // Main triangle shape
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.6);
    ctx.lineTo(x - size * 0.4, y + size * 0.4);
    ctx.lineTo(x - size * 0.15, y + size * 0.2);
    ctx.lineTo(x + size * 0.15, y + size * 0.2);
    ctx.lineTo(x + size * 0.4, y + size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Bright inner core
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - size * 0.1, y - size * 0.1, size * 0.2, size * 0.2);

    // Thrust particles (nur jeden 2. Frame)
    if (frameCount % 2 === 0 && (player.isMovingLeft || player.isMovingRight)) {
        for (let i = 0; i < 1; i++) {
            const thrust = new PlayerThrust(x + (Math.random() - 0.5) * 8, y + size * 0.5);
            player.particles.push(thrust);
        }
    }

    // Draw und update particles (max 50 pro Player)
    if (player.particles.length > 50) {
        player.particles.splice(0, player.particles.length - 50);
    }
    for (let i = player.particles.length - 1; i >= 0; i--) {
        player.particles[i].update();
        player.particles[i].draw(ctx);
        if (player.particles[i].life <= 0) {
            player.particles.splice(i, 1);
        }
    }
}

function drawAimline() {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x, 0);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        // Main bullet nur (kein Glow)
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(bullet.x - bulletSize / 2, bullet.y, bulletSize, bulletSize * 4);
    }
}

function drawAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        
        // Asteroid glow (nur jeden 3. Frame)
        if (frameCount % 3 === 0) {
            ctx.fillStyle = `rgba(255, 0, 255, 0.1)`;
            ctx.fillRect(asteroid.x - asteroid.size * 1.3, asteroid.y - asteroid.size * 1.3, 
                        asteroid.size * 2.6, asteroid.size * 2.6);
        }

        // Main asteroid (vereinfacht zu Quad statt Polygon)
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(asteroid.x - asteroid.size, asteroid.y - asteroid.size, 
                    asteroid.size * 2, asteroid.size * 2);

        // Border
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(asteroid.x - asteroid.size, asteroid.y - asteroid.size, 
                      asteroid.size * 2, asteroid.size * 2);
    }
}

function createExplosion(x, y, size) {
    const particleCount = Math.min(size, 15);
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 6 + 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const color = Math.random() > 0.5 ? 'rgba(255, 0, 255, 1)' : 'rgba(0, 255, 136, 1)';
        getParticle(x, y, vx, vy, color, 40 + Math.random() * 20);
    }
}

function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
            particlePool.push(p);
            particles.splice(i, 1);
        }
    }
    ctx.globalAlpha = 1;
}

function updateScore(points) {
    score += points;
    comboCounter++;
    
    // Update combo display
    if (comboCounter > 1) {
        comboDisplay.style.display = 'flex';
        comboValue.textContent = `x${comboCounter}`;
        comboValue.style.animation = 'none';
        setTimeout(() => {
            comboValue.style.animation = 'score-pulse 0.3s ease-out';
        }, 10);
    }

    // Clear combo timeout
    clearTimeout(comboTimeout);
    comboTimeout = setTimeout(() => {
        comboCounter = 0;
        comboDisplay.style.display = 'none';
    }, 2000);

    scoreValue.style.animation = 'none';
    setTimeout(() => {
        scoreValue.style.animation = 'score-pulse 0.3s ease-out';
    }, 10);
    scoreValue.textContent = score;
}

function updateHealth(damage) {
    health = Math.max(0, health - damage);
    const healthPercent = (health / maxHealth) * 100;
    healthBar.style.width = healthPercent + '%';

    if (health <= 0) {
        endGame();
    }
}

function update() {
    if (gameOver) {
        return;
    }

    frameCount++;

    // Player movement
    if (player.isMovingLeft && player.x > player.size) {
        player.x -= player.currentSpeed;
    }
    if (player.isMovingRight && player.x < canvas.width - player.size) {
        player.x += player.currentSpeed;
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bulletSpeed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    // Spawn asteroids (weniger häufig)
    if (Math.random() < 1 / spawnRate) {
        asteroids.push({
            x: Math.random() * canvas.width,
            y: -40,
            size: 15 + Math.random() * 25,
            speed: asteroidSpeed + Math.random() * 1
        });
    }

    // Update asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].y += asteroids[i].speed * gameSpeed;

        // Collision with bullets (optimiert)
        let hit = false;
        for (let j = bullets.length - 1; j >= 0; j--) {
            const dx = bullets[j].x - asteroids[i].x;
            const dy = bullets[j].y - asteroids[i].y;
            const distance = dx * dx + dy * dy;
            const size = asteroids[i].size;
            
            if (distance < size * size) {
                // Hit!
                createExplosion(asteroids[i].x, asteroids[i].y, asteroids[i].size);
                const points = Math.floor(asteroids[i].size * 2);
                updateScore(points);
                asteroids_destroyed++;
                asteroids.splice(i, 1);
                bullets.splice(j, 1);
                hit = true;
                break;
            }
        }

        // Collision with player / out of bounds
        if (!hit && asteroids[i]) {
            if (asteroids[i].y > canvas.height) {
                createExplosion(asteroids[i].x, asteroids[i].y, asteroids[i].size);
                updateHealth(15 + asteroids[i].size / 2);
                asteroids.splice(i, 1);
            }
        }
    }

    // Difficulty increase
    if (score > 0 && score % 500 === 0 && !isDifficultyIncreased) {
        gameSpeed += 0.05;
        asteroidSpeed += 0.3;
        if (spawnRate > 30) {
            spawnRate -= 3;
        }
        isDifficultyIncreased = true;
    } else if (score % 500 !== 0) {
        isDifficultyIncreased = false;
    }

    // Draw everything - optimiert
    ctx.fillStyle = 'rgba(10, 14, 39, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background (nur jeden 2. Frame)
    if (frameCount % 2 === 0) {
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 100) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 100) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
    }

    drawAsteroids();
    drawBullets();
    drawParticles();
    drawPlayer();
    drawAimline();
}

function endGame() {
    gameOver = true;
    gameOverScreen.style.display = 'flex';
    
    const accuracy = bullets_shot > 0 ? Math.round((asteroids_destroyed / bullets_shot) * 100) : 0;
    
    finalScoreDisplay.textContent = score;
    asteroidsDestroyedDisplay.textContent = asteroids_destroyed;
    accuracyDisplay.textContent = accuracy + '%';
}

function resetGame() {
    score = 0;
    gameOver = false;
    gameSpeed = 1;
    isDifficultyIncreased = false;
    health = maxHealth;
    comboCounter = 0;
    bullets_shot = 0;
    asteroids_destroyed = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height - 80;
    player.particles = [];
    bullets.length = 0;
    asteroids.length = 0;
    particles.length = 0;
    spawnRate = 80;
    asteroidSpeed = 2;

    scoreValue.textContent = '0';
    healthBar.style.width = '100%';
    gameOverScreen.style.display = 'none';
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        player.isMovingLeft = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        player.isMovingRight = true;
    }
    if (e.key === 'Shift') {
        player.currentSpeed = player.boostSpeed;
        player.isBoostActive = true;
    }
    if (e.key === ' ' && !gameOver && canShoot) {
        bullets.push({
            x: player.x,
            y: player.y - player.size * 0.8
        });
        bullets_shot++;
        canShoot = false;
        setTimeout(() => {
            canShoot = true;
        }, shootCooldown);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        player.isMovingLeft = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        player.isMovingRight = false;
    }
    if (e.key === 'Shift') {
        player.currentSpeed = player.speed;
        player.isBoostActive = false;
    }
});

resetButton.addEventListener('click', resetGame);

// Game loop - mit requestAnimationFrame statt setInterval
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
