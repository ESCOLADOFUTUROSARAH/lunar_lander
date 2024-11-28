// Importações dos módulos necessários
import { Lander } from './Lander.js';
import { StarField } from './StarField.js';
import { DustParticle } from './DustParticle.js';

document.addEventListener("DOMContentLoaded", () => {
    // Configuração do canvas
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Ajusta o tamanho do canvas para ocupar toda a janela
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Instanciação dos objetos do jogo
    const lander = new Lander(ctx, canvas);
    const starField = new StarField(ctx, canvas);

    // Variáveis de estado do jogo
    let gameRunning = true;
    let lives = 3;
    let score = 0;

    // Configuração da plataforma de pouso
    const platformHeight = 10;
    const platformWidth = 100;
    let platformX = getRandomPlatformX();
    let platformY = canvas.height - platformHeight;

    // Elementos dos modais
    const landingModal = document.getElementById('landingModal');
    const gameOverModal = document.getElementById('gameOverModal');
    const finalGameOverModal = document.getElementById('finalGameOverModal');

    // Função principal do loop do jogo
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Atualizar e desenhar o campo de estrelas
        starField.update();
        starField.draw();

        if (gameRunning) {
            // Atualizar e desenhar a nave
            lander.update();
            lander.draw();

            // Verificar aterrissagem
            checkLanding();

            // Verificar se a nave explodiu e a explosão terminou
            if (lander.isExploding && lander.explosionDuration <= 0) {
                if (lives > 0) {
                    lives--;
                    setTimeout(() => {
                        lander.resetPosition();
                        platformX = getRandomPlatformX();
                        gameRunning = true;
                    }, 2000); // Tempo para exibir a explosão antes de reiniciar
                } else {
                    showFinalGameOverModal();
                }
                gameRunning = false;
            }
        } else {
            // Continuar animando partículas se houver
            if (lander.particles.length > 0) {
                lander.update();
                lander.draw();
            }
        }

        // Desenhar elementos da interface
        drawLives();
        drawPlatform();
        drawScore();

        requestAnimationFrame(loop);
    }

    // Desenha a plataforma de pouso
    function drawPlatform() {
        ctx.fillStyle = "white";
        ctx.fillRect(platformX, platformY, platformWidth, platformHeight);
    }

    // Gera uma posição aleatória para a plataforma
    function getRandomPlatformX() {
        return Math.random() * (canvas.width - platformWidth);
    }

    // Verifica se a nave aterrissou com sucesso
    function checkLanding() {
        const landerBottom = lander.centerY + lander.triangleHeight / 2;

        if (
            !lander.hasLanded &&
            landerBottom >= platformY &&
            landerBottom <= platformY + platformHeight &&
            lander.centerX >= platformX &&
            lander.centerX <= platformX + platformWidth &&
            Math.abs(lander.velocityY) <= lander.maxLandingSpeed
        ) {
            score += 50;
            lander.fuel = Math.min(lander.maxFuel, lander.fuel + lander.maxFuel * 0.3);
            lander.hasLanded = true;

            // Emitir partículas de pouso
            for (let i = 0; i < 20; i++) {
                lander.particles.push(new DustParticle(ctx, lander.centerX, landerBottom, {
                    size: Math.random() * 2 + 1,
                    color: '255, 255, 255', // Branco
                    speedX: (Math.random() - 0.5) * 2,
                    speedY: Math.random() * -2,
                    gravity: 0.05,
                    fadeRate: 0.02
                }));
            }

            showLandingModal();
            gameRunning = false;
        }
    }

    // Desenha a pontuação
    function drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(`Pontuação: ${score}`, 20, canvas.height - 20);
    }

    // Desenha as vidas restantes
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

    // Reinicia o jogo após uma aterrissagem bem-sucedida ou perda de vida
    function restartGame() {
        landingModal.classList.remove('show');
        gameOverModal.classList.remove('show');
        finalGameOverModal.classList.remove('show');
        lander.resetPosition();
        platformX = getRandomPlatformX();
        gameRunning = true;
    }

    // Exibe o modal de game over
    function showGameOverModal() {
        gameOverModal.classList.add('show');
        gameRunning = false;
    }

    // Exibe o modal de game over final
    function showFinalGameOverModal() {
        finalGameOverModal.classList.add('show');
        gameRunning = false;
    }

    // Exibe o modal de aterrissagem bem-sucedida
    function showLandingModal() {
        landingModal.classList.add('show');
        gameRunning = false;
    }

    // Eventos dos botões nos modais
    document.getElementById('restartButton').addEventListener('click', () => {
        restartGame();
    });

    document.getElementById('gameOverRestartButton').addEventListener('click', () => {
        if (lives > 0) {
            lives--;
            restartGame();
        } else {
            showFinalGameOverModal();
        }
    });

    document.getElementById('closeGameButton').addEventListener('click', () => {
        finalGameOverModal.classList.remove('show');
        window.location.reload();
    });

    // Eventos de teclado para controlar a nave
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

    // Ajusta o canvas ao redimensionar a janela
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        platformX = getRandomPlatformX();
        platformY = canvas.height - platformHeight;
        starField.resize(canvas.width, canvas.height);
    });

    // Inicia o loop do jogo
    loop();
});
