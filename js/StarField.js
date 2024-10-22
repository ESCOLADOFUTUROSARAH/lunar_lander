export class StarField {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.stars = [];

        // Criar estrelas com posição, raio e opacidade aleatórios
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * canvas.width,    // Posição X aleatória no canvas
                y: Math.random() * canvas.height,   // Posição Y aleatória no canvas
                radius: Math.random() * 1 + 1,      // Raio da estrela (tamanho aleatório)
                opacity: Math.random()              // Opacidade inicial (brilho)
            });
        }
    }

    // Método para desenhar as estrelas no canvas
    draw() {
        for (let star of this.stars) {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;  // Branco com opacidade variável
            this.ctx.fill();
        }
    }

    // Método para atualizar a opacidade das estrelas e criar o efeito de cintilação
    update() {
        for (let star of this.stars) {
            // Alterar levemente a opacidade para simular o brilho
            star.opacity += (Math.random() - 0.5) * 0.02;  // Cintilação aleatória

            // Garantir que a opacidade esteja entre 0 e 1
            if (star.opacity < 0) star.opacity = 0;  // Evitar opacidade negativa
            if (star.opacity > 1) star.opacity = 1;  // Limitar opacidade a 1 (máximo de brilho)
        }
    }
}
