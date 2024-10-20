document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Ajustando o tamanho do canvas pelo JS
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Definindo as dimensões do triângulo
    const triangleHeight = 25;
    const triangleBase = 25;

    // Calculando a posição inicial do triângulo
    let centerX = canvas.width / 2;
    let centerY = 50;

    // Definindo a gravidade
    const gravity = 0.162; // Gravidade da Lua em m/s² (simulada)
    let velocityY = 0;
    let velocityX = 0;
    let hasLanded = false;

    // Estado das teclas
    let keys = {
        ArrowUp: false,
        ArrowLeft: false,
        ArrowRight: false
    };

    // Criando estrelas no fundo
    const stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1 + 1,
            opacity: Math.random()
        });
    }

    function drawStars() {
        for (let star of stars) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        }
    }

    function drawTriangle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar o canvas

        drawStars(); // Desenhar as estrelas no fundo

        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        // Desenhando o triângulo principal
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - triangleHeight / 2);  // Ponto superior
        ctx.lineTo(centerX - triangleBase / 2, centerY + triangleHeight / 2);  // Ponto inferior esquerdo
        ctx.lineTo(centerX + triangleBase / 2, centerY + triangleHeight / 2);  // Ponto inferior direito
        ctx.closePath();

        ctx.fill();  // Preencher o triângulo com preto
        ctx.stroke();  // Desenhar a borda branca

        // Desenhar boosters quando teclas são pressionadas
        ctx.fillStyle = "orange";
        if (keys.ArrowUp && (!hasLanded || centerY === canvas.height - triangleHeight / 2)) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY + triangleHeight / 2);  // Ponto inferior central
            ctx.lineTo(centerX - 5, centerY + triangleHeight / 2 + 15);  // Ponto inferior esquerdo
            ctx.lineTo(centerX + 5, centerY + triangleHeight / 2 + 15);  // Ponto inferior direito
            ctx.closePath();
            ctx.fill();
        }
        if (keys.ArrowLeft && !hasLanded) {
            ctx.beginPath();
            ctx.moveTo(centerX + triangleBase / 2, centerY);  // Ponto direito do triângulo
            ctx.lineTo(centerX + triangleBase / 2 + 15, centerY - 5);  // Ponto superior direito
            ctx.lineTo(centerX + triangleBase / 2 + 15, centerY + 5);  // Ponto inferior direito
            ctx.closePath();
            ctx.fill();
        }
        if (keys.ArrowRight && !hasLanded) {
            ctx.beginPath();
            ctx.moveTo(centerX - triangleBase / 2, centerY);  // Ponto esquerdo do triângulo
            ctx.lineTo(centerX - triangleBase / 2 - 15, centerY - 5);  // Ponto superior esquerdo
            ctx.lineTo(centerX - triangleBase / 2 - 15, centerY + 5);  // Ponto inferior esquerdo
            ctx.closePath();
            ctx.fill();
        }
    }

    function update() {
        if (hasLanded && !keys.ArrowUp) return;

        // Atualizar a velocidade e a posição devido à gravidade
        if (!hasLanded) {
            velocityY += gravity * 0.1;
        }
        centerY += velocityY;

        // Controle do booster de decolagem
        if (keys.ArrowUp) {
            if (hasLanded) {
                // Decolagem se a nave estiver aterrissada
                hasLanded = false;
                velocityY = -gravity * 1.5;
            } else {
                // Booster superior para frear a descida
                velocityY -= gravity * 0.3;
            }
        }
        if (keys.ArrowLeft && !hasLanded) {
            velocityX -= gravity * 0.2; // Booster para mover para a esquerda
        }
        if (keys.ArrowRight && !hasLanded) {
            velocityX += gravity * 0.2; // Booster para mover para a direita
        }

        // Atualizar a posição horizontal
        centerX += velocityX;

        // Impedir que o triângulo saia da tela verticalmente
        if (centerY + triangleHeight / 2 > canvas.height) {
            centerY = canvas.height - triangleHeight / 2;
            velocityY = 0;
            velocityX = 0;
            hasLanded = true; // Aterrissar a nave
        }
        if (centerY - triangleHeight / 2 < 0) {
            centerY = triangleHeight / 2;
            velocityY = 0;
        }

        // Impedir que o triângulo saia da tela horizontalmente
        if (centerX - triangleBase / 2 < 0) {
            centerX = triangleBase / 2;
            velocityX = 0;
        }
        if (centerX + triangleBase / 2 > canvas.width) {
            centerX = canvas.width - triangleBase / 2;
            velocityX = 0;
        }
    }

    function loop() {
        update();
        drawTriangle();
        requestAnimationFrame(loop);
    }

    // Event listeners para detectar teclas pressionadas
    window.addEventListener("keydown", function (e) {
        if (e.key in keys) {
            keys[e.key] = true;
        }
    });

    window.addEventListener("keyup", function (e) {
        if (e.key in keys) {
            keys[e.key] = false;
        }
    });

    loop();
});
