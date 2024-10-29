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

    // Definindo o número de vidas iniciais
    let lives = 3;

    // Modais de aterrissagem e game over
    const landingModal = document.getElementById('landingModal');
    const gameOverModal = document.getElementById('gameOverModal');
    const finalGameOverModal = document.getElementById('finalGameOverModal');  // Novo modal de game over final
    landingModal.style.display = 'none';
    gameOverModal.style.display = 'none';
    finalGameOverModal.style.display = 'none';

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

        // Desenhar as vidas restantes no canto superior direito
        drawLives();

        // Checar se ainda há partículas visíveis
        continueAnimatingParticles = lander.particles.length > 0;

        // Continuar o loop do jogo
        requestAnimationFrame(loop);
    }

    // Função para desenhar os triângulos de vida no canto superior direito
    function drawLives() {
        const triangleSize = 20;  // Tamanho do triângulo que representa uma vida
        const padding = 10;       // Espaço entre os triângulos e o canto do canvas
        const spacing = 30;       // Espaço entre cada triângulo
        const rightMargin = 40;   // Margem adicional para evitar que os triângulos fiquem colados na borda direita

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

    // Função para reduzir vidas e verificar fim de jogo
    function loseLife() {
        if (lives > 0) {
            lives--;  // Reduz uma vida
        }
        if (lives === 0) {
            // Exibir o modal de "Game Over" final
            showFinalGameOverModal();
        } else {
            restartGame(); // Reiniciar o jogo sem resetar as vidas
        }
    }

    // Função para reiniciar o jogo, mantendo o número de vidas atuais
    function restartGame() {
        landingModal.style.display = 'none';
        gameOverModal.style.display = 'none';

        // Redefinir a nave e outras variáveis
        lander.centerY = 50;
        lander.centerX = canvas.width / 2;
        lander.velocityY = 0;
        lander.velocityX = 0;
        lander.fuel = lander.maxFuel;
        lander.hasLanded = false;
        lander.isExploding = false;
        lander.explosionParts = [];
        lander.particles = [];

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

    // Eventos de clique para os botões de "Jogar novamente" e "Fechar o Jogo"
    document.getElementById('restartButton').addEventListener('click', restartGame);
    document.getElementById('gameOverRestartButton').addEventListener('click', loseLife);
    document.getElementById('closeGameButton').addEventListener('click', () => {
        finalGameOverModal.style.display = 'none';
        window.location.reload();  // Recarrega a página para reiniciar o jogo
    });

    // Controle da nave por teclado
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
