export class StarField {
    constructor(ctx, canvas, numStars = 100) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.numStars = numStars;
        this.stars = [];

        this.createStars();
    }

    // Método para criar as estrelas
    createStars() {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(this.createStar());
        }
    }

    // Cria uma única estrela com propriedades aleatórias
    createStar() {
        return {
            x: Math.random() * this.canvas.width,      // Posição X aleatória
            y: Math.random() * this.canvas.height,     // Posição Y aleatória
            radius: Math.random() * 1 + 0.5,           // Raio entre 0.5 e 1.5
            opacity: Math.random() * 0.5 + 0.5,        // Opacidade inicial entre 0.5 e 1
            speedY: Math.random() * 0.5 + 0.1          // Velocidade vertical entre 0.1 e 0.6
        };
    }

    // Método para desenhar as estrelas
    draw() {
        for (const star of this.stars) {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;  // Branco com opacidade
            this.ctx.fill();
        }
    }

    // Atualiza as estrelas para o efeito de cintilação e movimento
    update() {
        for (const star of this.stars) {
            // Efeito de cintilação
            star.opacity += (Math.random() - 0.5) * 0.02;  // Variação para cintilação
            star.opacity = Math.max(0.3, Math.min(star.opacity, 1));

            // Movimento vertical
            star.y += star.speedY;

            // Se a estrela sair da parte inferior, reposiciona no topo
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        }
    }

    // Atualiza o tamanho do canvas e recria as estrelas
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.createStars();
    }
}