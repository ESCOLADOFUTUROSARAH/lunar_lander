// js/StarField.js
export class StarField {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.stars = [];

        // Criar estrelas
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1 + 1,
                opacity: Math.random()
            });
        }
    }

    draw() {
        for (let star of this.stars) {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
        }
    }
}
