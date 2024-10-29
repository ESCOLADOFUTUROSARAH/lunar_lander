export class DustParticle {
    constructor(ctx, x, y, explosionForce = 1) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;  // Tamanho entre 1 e 4
        // Velocidade X afetada pela força da explosão
        this.speedX = (Math.random() - 0.5) * 2 * explosionForce;
        // Velocidade Y para uma dispersão mais realista
        this.speedY = Math.random() * -2 * explosionForce;
        this.gravity = 0.05;  // Gravidade para puxar partículas para baixo
        this.alpha = 1;       // Transparência inicial (opaca)
    }

    update() {
        // Atualiza a posição
        this.x += this.speedX;
        this.y += this.speedY;
        // A gravidade afeta a velocidade vertical, puxando a partícula para baixo
        this.speedY += this.gravity;
        // Transparência decresce com base na velocidade vertical
        this.alpha -= 0.02 / (Math.abs(this.speedY) + 1);
        this.alpha = Math.max(0, this.alpha);  // Evita valores negativos de alpha
    }

    draw() {
        // Define a cor branca com a transparência atual
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Círculo para a partícula
        this.ctx.closePath();
        this.ctx.fill();
    }

    isVisible() {
        // Verifica se a partícula ainda é visível
        return this.alpha > 0;
    }
}
