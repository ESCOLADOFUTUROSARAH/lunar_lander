export class DustParticle {
    constructor(ctx, x, y, options = {}) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;

        // Definir opções padrão e sobrescrever com as opções fornecidas
        const {
            size = Math.random() * 3 + 1,       // Tamanho entre 1 e 4
            color = '255, 255, 255',            // Cor padrão: branco
            alpha = 1,                          // Transparência inicial
            speedX = (Math.random() - 0.5) * 2, // Velocidade X aleatória
            speedY = Math.random() * -2,        // Velocidade Y aleatória (para cima)
            gravity = 0.05,                     // Gravidade que afeta a partícula
            fadeRate = 0.02                     // Taxa de desvanecimento da partícula
        } = options;

        this.size = size;
        this.color = color;
        this.alpha = alpha;
        this.speedX = speedX;
        this.speedY = speedY;
        this.gravity = gravity;
        this.fadeRate = fadeRate;
    }

    // Atualiza a posição e o estado da partícula
    update() {
        // Atualiza a posição com base nas velocidades
        this.x += this.speedX;
        this.y += this.speedY;

        // A gravidade afeta a velocidade vertical
        this.speedY += this.gravity;

        // A transparência diminui gradualmente para criar o efeito de desvanecimento
        this.alpha -= this.fadeRate;
        this.alpha = Math.max(0, this.alpha); // Garante que a transparência não seja negativa
    }

    // Desenha a partícula no canvas
    draw() {
        // Define a cor com a transparência atual
        this.ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Desenha um círculo
        this.ctx.fill();
    }

    // Verifica se a partícula ainda está visível
    isVisible() {
        return this.alpha > 0;
    }
}
