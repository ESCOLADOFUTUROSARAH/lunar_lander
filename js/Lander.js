// js/Lander.js
import { DustParticle } from './DustParticle.js';

export class Lander {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.triangleHeight = 25;
        this.triangleBase = 25;
        this.centerX = canvas.width / 2;
        this.centerY = 50;
        this.gravity = 0.162;
        this.velocityY = 0;
        this.velocityX = 0;
        this.hasLanded = false;
        this.keys = {
            ArrowUp: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.particles = [];  // Array para armazenar as partículas de poeira
    }

    draw() {
        const { ctx, centerX, centerY, triangleHeight, triangleBase } = this;

        // Desenhar o lander
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - triangleHeight / 2);
        ctx.lineTo(centerX - triangleBase / 2, centerY + triangleHeight / 2);
        ctx.lineTo(centerX + triangleBase / 2, centerY + triangleHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Desenhar as partículas de poeira
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Remover partículas que não são mais visíveis
        this.particles = this.particles.filter(particle => particle.isVisible());

        // Desenhar os boosters
        ctx.fillStyle = "orange";
        if (this.keys.ArrowUp && (!this.hasLanded || centerY === this.canvas.height - triangleHeight / 2)) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY + triangleHeight / 2);
            ctx.lineTo(centerX - 5, centerY + triangleHeight / 2 + 15);
            ctx.lineTo(centerX + 5, centerY + triangleHeight / 2 + 15);
            ctx.closePath();
            ctx.fill();
        }
        if (this.keys.ArrowLeft && !this.hasLanded) {
            ctx.beginPath();
            ctx.moveTo(centerX + triangleBase / 2, centerY);
            ctx.lineTo(centerX + triangleBase / 2 + 15, centerY - 5);
            ctx.lineTo(centerX + triangleBase / 2 + 15, centerY + 5);
            ctx.closePath();
            ctx.fill();
        }
        if (this.keys.ArrowRight && !this.hasLanded) {
            ctx.beginPath();
            ctx.moveTo(centerX - triangleBase / 2, centerY);
            ctx.lineTo(centerX - triangleBase / 2 - 15, centerY - 5);
            ctx.lineTo(centerX - triangleBase / 2 - 15, centerY + 5);
            ctx.closePath();
            ctx.fill();
        }
    }

    update() {
        if (this.hasLanded && !this.keys.ArrowUp) return;

        if (!this.hasLanded) {
            this.velocityY += this.gravity * 0.1;
        }
        this.centerY += this.velocityY;

        if (this.keys.ArrowUp) {
            if (this.hasLanded) {
                this.hasLanded = false;
                this.velocityY = -this.gravity * 1.5;
            } else {
                this.velocityY -= this.gravity * 0.3;
            }
        }
        if (this.keys.ArrowLeft && !this.hasLanded) {
            this.velocityX -= this.gravity * 0.2;
        }
        if (this.keys.ArrowRight && !this.hasLanded) {
            this.velocityX += this.gravity * 0.2;
        }

        this.centerX += this.velocityX;

        if (this.centerY + this.triangleHeight / 2 > this.canvas.height) {
            this.centerY = this.canvas.height - this.triangleHeight / 2;
            this.velocityY = 0;
            this.velocityX = 0;
            this.hasLanded = true;

            // Gerar partículas de poeira ao aterrissar
            for (let i = 0; i < 20; i++) {
                this.particles.push(new DustParticle(this.ctx, this.centerX, this.centerY + this.triangleHeight / 2));
            }
        }
    }
}
