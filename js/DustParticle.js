// js/DustParticle.js
export class DustParticle {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;  // Tamanho aleatório
        this.speedX = (Math.random() - 0.5) * 2;  // Velocidade aleatória no eixo X
        this.speedY = Math.random() * -2;  // Velocidade para cima
        this.gravity = 0.05;  // Gravidade que afeta as partículas
        this.alpha = 1;  // Transparência inicial
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;  // Aplicar gravidade nas partículas
        this.alpha -= 0.02;  // Desvanecer a partícula com o tempo
    }

    draw() {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;  // Cor de poeira com transparência
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    isVisible() {
        return this.alpha > 0;  // A partícula continua visível enquanto a transparência for maior que 0
    }
}
