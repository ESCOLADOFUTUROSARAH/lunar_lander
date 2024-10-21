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

    // Garantir que a modal esteja escondida no início
    const modal = document.getElementById('landingModal');
    modal.style.display = 'none';  // Esconder a modal no início

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela

        starField.draw(); // Desenha as estrelas
        lander.update();  // Atualiza a posição da nave e gera poeira se necessário
        lander.draw();    // Desenha a nave e a poeira

        requestAnimationFrame(loop); // Loop contínuo
    }

    // Reiniciar o jogo ao clicar em "Jogar novamente"
    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Esconder a modal
        lander.centerY = 50;  // Reposicionar a nave no início
        lander.centerX = canvas.width / 2;
        lander.velocityY = 0;
        lander.velocityX = 0;
        lander.fuel = lander.maxFuel;
        lander.hasLanded = false;

        // Resetar os eventos de controle de teclado para os boosters
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
    });

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
