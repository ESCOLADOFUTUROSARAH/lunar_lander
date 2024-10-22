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
    let continueAnimatingParticles = false;  // Variável para continuar animando as partículas após a aterrissagem/explosão

    // Garantir que as modais de aterrissagem e game over estejam escondidas no início
    const landingModal = document.getElementById('landingModal');
    const gameOverModal = document.getElementById('gameOverModal');
    landingModal.style.display = 'none';
    gameOverModal.style.display = 'none';

    function loop() {
        // Continuar o loop se o jogo estiver em execução ou se ainda houver partículas visíveis
        if (!gameRunning && !continueAnimatingParticles) return;

        // Limpar o canvas para o próximo frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Atualizar e desenhar as estrelas no fundo
        starField.update();
        starField.draw();

        // Atualizar a posição e o estado da nave se o jogo estiver rodando
        if (gameRunning) {
            lander.update();
        }

        // Desenhar a nave (ou explosão, se estiver explodindo)
        lander.draw();

        // Verificar se ainda existem partículas visíveis
        if (lander.particles.length > 0) {
            continueAnimatingParticles = true;  // Continuar o loop enquanto houver partículas
        } else {
            continueAnimatingParticles = false;  // Parar o loop quando todas as partículas sumirem
        }

        // Continuar o loop do jogo
        requestAnimationFrame(loop);
    }

    // Função para reiniciar o jogo
    function restartGame() {
        // Esconder ambas as modais
        landingModal.style.display = 'none';
        gameOverModal.style.display = 'none';

        // Resetar a nave, combustível e estado de explosão
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

    // Função para parar o loop quando o jogo termina (explosão ou aterrissagem)
    function endGame() {
        gameRunning = false;  // Parar o loop do jogo
    }

    // Eventos de clique para os botões de "Jogar novamente"
    const restartButton = document.getElementById('restartButton');
    const gameOverRestartButton = document.getElementById('gameOverRestartButton');

    restartButton.addEventListener('click', restartGame);
    gameOverRestartButton.addEventListener('click', restartGame);

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

    // Redimensionar o canvas se a janela do navegador for redimensionada
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Iniciar o loop do jogo
    loop();

    // Adicionar o controle de fim de jogo no lander
    lander.showGameOverModal = function () {
        const modal = document.getElementById('gameOverModal');
        modal.style.display = 'flex';  // Exibir a modal de "Game Over"
        endGame();  // Parar o loop do jogo
    };

    lander.showLandingModal = function () {
        const modal = document.getElementById('landingModal');
        modal.style.display = 'flex';  // Exibir a modal de sucesso na aterrissagem
        endGame();  // Parar o loop do jogo, mas continuar animando as partículas
    };
});
