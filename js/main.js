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

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela

        starField.draw(); // Desenha as estrelas
        lander.update();  // Atualiza a posição da nave
        lander.draw();    // Desenha a nave

        requestAnimationFrame(loop); // Loop contínuo
    }

    // Event listeners para o controle do lander
    window.addEventListener("keydown", (e) => {
        if (e.key in lander.keys) {
            lander.keys[e.key] = true;
        }
    });

    window.addEventListener("keyup", (e) => {
        if (e.key in lander.keys) {
            lander.keys[e.key] = false;
        }
    });

    loop(); // Inicia o loop
});
