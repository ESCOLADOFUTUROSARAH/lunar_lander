export class DustParticle {
    constructor(ctx, x, y, explosionForce = 1) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;  // Tamanho aleatório entre 1 e 4
        // Velocidade X afetada pela força da explosão, maior explosão gera maior dispersão horizontal
        this.speedX = (Math.random() - 0.5) * 2 * explosionForce;
        // Velocidade Y afetada pela força da explosão, partículas sobem mais rapidamente com maior força
        this.speedY = Math.random() * -2 * explosionForce;
        this.gravity = 0.05;  // Gravidade que puxa as partículas de volta para baixo
        this.alpha = 1;  // Transparência inicial, começando totalmente opaca
    }

    update() {
        // Atualiza a posição da partícula
        this.x += this.speedX;
        this.y += this.speedY;
        // A gravidade reduz gradualmente a velocidade vertical, puxando a partícula para baixo
        this.speedY += this.gravity;
        // A transparência diminui com o tempo, fazendo a partícula desaparecer
        this.alpha -= (0.02 / (Math.abs(this.speedY) + 1));  // Desaparece mais rápido quanto maior a velocidade
    }

    draw() {
        // Desenha a partícula no canvas com a cor branca e a opacidade atual
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);  // Desenha um círculo representando a partícula
        this.ctx.closePath();
        this.ctx.fill();  // Preenche o círculo com a cor definida
    }

    isVisible() {
        // Verifica se a partícula ainda é visível (enquanto a transparência for maior que 0)
        return this.alpha > 0;
    }
}
