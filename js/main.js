// js/main.js
import { Lander } from './Lander.js';
import { StarField } from './StarField.js';

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lander = new Lander(ctx, canvas);
    const starField = new StarField(ctx, canvas);

    // Garantir que as modais estejam escondidas no início
    const landingModal = document.getElementById('landingModal');
    const gameOverModal = document.getElementById('gameOverModal');
    landingModal.style.display = 'none';
    gameOverModal.style.display = 'none';

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela

        starField.draw(); // Desenha as estrelas
        lander.update();  // Atualiza a posição da nave e gera poeira se necessário
        lander.draw();    // Desenha a nave e a poeira

        requestAnimationFrame(loop); // Loop contínuo
    }

    // Reiniciar o jogo ao clicar em "Jogar novamente" nas duas modais
    const restartButton = document.getElementById('restartButton');
    const gameOverRestartButton = document.getElementById('gameOverRestartButton');

    function restartGame() {
        landingModal.style.display = 'none';  // Esconder as modais
        gameOverModal.style.display = 'none';
        lander.centerY = 50;  // Reposicionar a nave no início
        lander.centerX = canvas.width / 2;
        lander.velocityY = 0;
        lander.velocityX = 0;
        lander.fuel = lander.maxFuel;
        lander.hasLanded = false;
    }

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

    loop(); // Inicia o loop
});
