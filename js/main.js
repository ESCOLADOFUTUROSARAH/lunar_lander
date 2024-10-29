import { Lander } from './Lander.js';
import { StarField } from './StarField.js';
import { DustParticle } from './DustParticle.js';

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lander = new Lander(ctx, canvas);
    const starField = new StarField(ctx, canvas);

    let gameRunning = true;
    let continueAnimatingParticles = false;
    let lives = 3;
    let score = 0;

    // Plataforma inicial
    const platformHeight = 10;
    const platformWidth = 100;
    let platformX = getRandomPlatformX();
    const platformY = canvas.height - platformHeight;

    const landingModal = document.getElementById('landingModal');
    const gameOverModal = document.getElementById('gameOverModal');
    const finalGameOverModal = document.getElementById('finalGameOverModal');
    landingModal.style.display = 'none';
    gameOverModal.style.display = 'none';
    finalGameOverModal.style.display = 'none';

    function loop() {
        if (!gameRunning && !continueAnimatingParticles) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        starField.update();
        starField.draw();

        if (gameRunning) {
            lander.update();
            checkLanding();
        }

        lander.draw();
        drawLives();
        drawPlatform();
        drawScore();

        continueAnimatingParticles = lander.particles.length > 0;

        requestAnimationFrame(loop);
    }

    // Função para desenhar a plataforma
    function drawPlatform() {
        ctx.fillStyle = "white";
        ctx.fillRect(platformX, platformY, platformWidth, platformHeight);
    }

    // Função para obter uma nova posição aleatória para a plataforma
    function getRandomPlatformX() {
        return Math.random() * (canvas.width - platformWidth);
    }

    // Função para verificar a aterrissagem
    function checkLanding() {
        const landerBottom = lander.centerY + lander.triangleHeight / 2;

        // Verifica se a nave já pousou para evitar múltiplas contagens
        if (
            !lander.hasLanded &&  // Adiciona verificação para evitar multiplicação do efeito
            landerBottom >= platformY &&
            landerBottom <= platformY + platformHeight &&
            lander.centerX >= platformX &&
            lander.centerX <= platformX + platformWidth &&
            Math.abs(lander.velocityY) <= lander.maxLandingSpeed
        ) {
            // Aterrissagem bem-sucedida na plataforma
            score += 50;
            lander.fuel = Math.min(lander.maxFuel, lander.fuel + lander.maxFuel * 0.1);
            lander.hasLanded = true;

            // Gerar partículas de poeira na aterrissagem
            for (let i = 0; i < 20; i++) {
                lander.particles.push(new DustParticle(ctx, lander.centerX, landerBottom));
            }

            // Adicionar um atraso para exibir o efeito de poeira antes da modal
            setTimeout(showLandingModal, 500);
        }
    }

    function drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(`Score: ${score}`, 20, canvas.height - 20);
    }

    function drawLives() {
        const triangleSize = 20;
        const padding = 10;
        const spacing = 30;
        const rightMargin = 40;

        for (let i = 0; i < lives; i++) {
            const x = canvas.width - rightMargin - padding - i * spacing;
            const y = padding;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - triangleSize / 2, y + triangleSize);
            ctx.lineTo(x + triangleSize / 2, y + triangleSize);
            ctx.closePath();

            ctx.fillStyle = "white";
            ctx.fill();
        }
    }

    function loseLife() {
        if (lives > 0) {
            lives--;
        }
        if (lives === 0) {
            showFinalGameOverModal();
        } else {
            restartGame();
        }
    }

    function restartGame() {
        landingModal.style.display = 'none';
        gameOverModal.style.display = 'none';

        lander.centerY = 50;
        lander.centerX = canvas.width / 2;
        lander.velocityY = 0;
        lander.velocityX = 0;
        lander.fuel = lander.maxFuel;
        lander.hasLanded = false;  // Resetando para a próxima rodada
        lander.isExploding = false;
        lander.explosionParts = [];
        lander.particles = [];

        // Reposicionar a plataforma para a próxima rodada
        platformX = getRandomPlatformX();

        gameRunning = true;
        continueAnimatingParticles = false;
        loop();
    }

    function endGame() {
        gameRunning = false;
    }

    function showGameOverModal() {
        gameOverModal.style.display = 'flex';
        endGame();
    }

    function showFinalGameOverModal() {
        finalGameOverModal.style.display = 'flex';
        endGame();
    }

    function showLandingModal() {
        landingModal.style.display = 'flex';
        endGame();
    }

    document.getElementById('restartButton').addEventListener('click', restartGame);
    document.getElementById('gameOverRestartButton').addEventListener('click', loseLife);
    document.getElementById('closeGameButton').addEventListener('click', () => {
        finalGameOverModal.style.display = 'none';
        window.location.reload();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key in lander.keys) {
            lander.keys[e.key] = true;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key in lander.keys) {
            lander.keys[e.key] = false;
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        restartGame();
    });

    loop();

    lander.showGameOverModal = showGameOverModal;
    lander.showLandingModal = showLandingModal;
});
