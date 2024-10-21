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
        this.gravity = 0.162; // Gravidade da Lua
        this.velocityY = 0;
        this.velocityX = 0;
        this.hasLanded = false;
        this.fuel = 100;  // Combustível inicial (100%)
        this.maxFuel = 100;
        this.fuelConsumptionRate = 0.2;  // Quanto de combustível é consumido por ação
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

        // Desenhar a barra de combustível
        this.drawFuelBar();
    }

    drawFuelBar() {
        const barWidth = 200;
        const barHeight = 20;
        const margin = 20;
        const fuelPercentage = this.fuel / this.maxFuel;

        // Desenhar o texto "Nível de Combustível" acima da barra
        this.ctx.fillStyle = "white";
        this.ctx.font = "10px Arial";
        this.ctx.fillText("Nível de Combustível", margin, margin - 5);

        // Desenhar a borda da barra
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(margin, margin, barWidth, barHeight);

        // Desenhar a barra de combustível
        this.ctx.fillStyle = "orange";
        this.ctx.fillRect(margin, margin, barWidth * fuelPercentage, barHeight);
    }

    update() {
        if (this.hasLanded && !this.keys.ArrowUp) return;

        if (!this.hasLanded) {
            this.velocityY += this.gravity * 0.1;
        }
        this.centerY += this.velocityY;

        if (this.keys.ArrowUp && this.fuel > 0) {
            if (this.hasLanded) {
                this.hasLanded = false;
                this.velocityY = -this.gravity * 1.5;
            } else {
                this.velocityY -= this.gravity * 0.3;
            }
            this.consumeFuel();
        }
        if (this.keys.ArrowLeft && !this.hasLanded && this.fuel > 0) {
            this.velocityX -= this.gravity * 0.2;
            this.consumeFuel();
        }
        if (this.keys.ArrowRight && !this.hasLanded && this.fuel > 0) {
            this.velocityX += this.gravity * 0.2;
            this.consumeFuel();
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

    consumeFuel() {
        // Reduz o combustível quando os boosters são usados
        this.fuel -= this.fuelConsumptionRate;
        if (this.fuel < 0) {
            this.fuel = 0;  // Não deixar o combustível ir abaixo de 0
        }
    }
}
