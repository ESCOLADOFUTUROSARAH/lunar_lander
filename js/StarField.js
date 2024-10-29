export class StarField {
    constructor(ctx, canvas, numStars = 100) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.stars = [];

        // Criar estrelas com posição, raio e opacidade aleatórios
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * canvas.width,      // Posição X aleatória
                y: Math.random() * canvas.height,     // Posição Y aleatória
                radius: Math.random() * 1 + 0.5,      // Raio entre 0.5 e 1.5 para maior variação
                opacity: Math.random() * 0.5 + 0.5    // Opacidade inicial entre 0.5 e 1
            });
        }
    }

    // Método para desenhar as estrelas
    draw() {
        for (let star of this.stars) {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;  // Branco com opacidade
            this.ctx.fill();
        }
    }

    // Atualiza a opacidade das estrelas para o efeito de cintilação
    update() {
        for (let star of this.stars) {
            // Ajuste sutil na opacidade para uma cintilação suave
            star.opacity += (Math.random() - 0.5) * 0.01;  // Variação menor para cintilação controlada

            // Limitar opacidade entre 0.3 e 1 para evitar estrelas muito apagadas
            star.opacity = Math.max(0.3, Math.min(star.opacity, 1));
        }
    }
}
