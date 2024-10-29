import { Lander } from './Lander.js';
import { StarField } from './StarField.js';

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lander = new Lander(ctx, canvas);
    const starField = new StarField(ctx, canvas);

    let gameRunning = true;  // Controla o estado do loop do jogo
    let continueAnimatingParticles = false;  // Continua a animação das partículas após o jogo

    // Modais de aterrissagem e game over
    const landingModal = document.getElementById('landingModal');
    const gameOverModal = document.getElementById('gameOverModal');
    landingModal.style.display = 'none';
    gameOverModal.style.display = 'none';

    function loop() {
        // Se o jogo parou e não há mais partículas, sair do loop
        if (!gameRunning && !continueAnimatingParticles) return;

        // Limpar o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Atualizar e desenhar o fundo de estrelas
        starField.update();
        starField.draw();

        // Atualizar a nave enquanto o jogo estiver rodando
        if (gameRunning) {
            lander.update();
        }

        // Desenhar a nave ou sua explosão
        lander.draw();

        // Checar se ainda há partículas visíveis
        continueAnimatingParticles = lander.particles.length > 0;

        // Continuar o loop do jogo
        requestAnimationFrame(loop);
    }

    // Função para reiniciar o jogo
    function restartGame() {
        // Esconder as modais
        landingModal.style.display = 'none';
        gameOverModal.style.display = 'none';

        // Redefinir a nave, combustível, e outras variáveis
        lander.centerY = 50;
        lander.centerX = canvas.width / 2;
        lander.velocityY = 0;
        lander.velocityX = 0;
        lander.fuel = lander.maxFuel;
        lander.hasLanded = false;
        lander.isExploding = false;
        lander.explosionParts = [];
        lander.particles = [];  // Limpar as partículas

        // Reiniciar o loop do jogo
        gameRunning = true;
        continueAnimatingParticles = false;
        loop();
    }

    // Função para parar o jogo ao término (explosão ou aterrissagem)
    function endGame() {
        gameRunning = false;
    }

    // Funções para mostrar modais específicas
    function showGameOverModal() {
        gameOverModal.style.display = 'flex';
        endGame();
    }

    function showLandingModal() {
        landingModal.style.display = 'flex';
        endGame();
    }

    // Eventos de clique para os botões de "Jogar novamente"
    document.getElementById('restartButton').addEventListener('click', restartGame);
    document.getElementById('gameOverRestartButton').addEventListener('click', restartGame);

    // Capturar eventos de teclado para controlar a nave
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

    // Redimensionar o canvas ao ajustar a janela do navegador
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        restartGame(); // Reiniciar para ajustar a nave à nova dimensão
    });

    // Iniciar o loop do jogo
    loop();

    // Adicionar controle de fim de jogo na nave
    lander.showGameOverModal = showGameOverModal;
    lander.showLandingModal = showLandingModal;
});
