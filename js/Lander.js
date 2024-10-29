import { DustParticle } from './DustParticle.js';

export class Lander {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.triangleHeight = 25;  // Altura da nave
        this.triangleBase = 25;    // Base da nave
        this.centerX = canvas.width / 2;  // Posição inicial X
        this.centerY = 50;                 // Posição inicial Y
        this.gravity = 0.162;             // Gravidade da Lua (ajustável para outros planetas)
        this.velocityY = 0;               // Velocidade vertical inicial
        this.velocityX = 0;               // Velocidade horizontal inicial
        this.hasLanded = false;           // Status da aterrissagem
        this.isExploding = false;         // Estado para controlar a explosão
        this.explosionParts = [];         // Partes da nave para a explosão
        this.explosionDuration = 60;      // Duração da animação de explosão (frames)
        this.fuel = 100;                  // Combustível inicial
        this.maxFuel = 100;               // Capacidade máxima de combustível
        this.fuelConsumptionRate = 0.2;   // Taxa de consumo de combustível
        this.maxLandingSpeed = 2;         // Velocidade máxima de aterrissagem segura
        this.maxVelocityX = 5;            // Limite de velocidade horizontal
        this.keys = {                     // Controles do teclado
            ArrowUp: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.particles = [];  // Partículas de poeira para efeito visual
    }

    draw() {
        const { ctx, centerX, centerY, triangleHeight, triangleBase } = this;

        if (this.isExploding) {
            this.drawExplosion();
        } else {
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

            if (!this.isExploding) {
                this.drawFuelBar();
            }
        }

        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        this.particles = this.particles.filter(particle => particle.isVisible());
    }

    drawFuelBar() {
        const barWidth = 200;
        const barHeight = 20;
        const margin = 20;
        const fuelPercentage = this.fuel / this.maxFuel;

        this.ctx.fillStyle = "white";
        this.ctx.font = "10px Arial";
        this.ctx.fillText("Nível de Combustível".toUpperCase(), margin, margin - 5);

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(margin, margin, barWidth, barHeight);

        this.ctx.fillStyle = fuelPercentage > 0.2 ? "orange" : "red";
        this.ctx.fillRect(margin, margin, barWidth * fuelPercentage, barHeight);
    }

    update() {
        if (this.isExploding) {
            this.updateExplosion();
            return;
        }

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

        this.velocityX = Math.max(Math.min(this.velocityX, this.maxVelocityX), -this.maxVelocityX);
        this.centerX += this.velocityX;

        if (this.centerY + this.triangleHeight / 2 > this.canvas.height) {
            if (Math.abs(this.velocityY) > this.maxLandingSpeed) {
                this.triggerExplosion();
                return;
            }

            this.hasLanded = true;
            this.showLandingModal();

            this.centerY = this.canvas.height - this.triangleHeight / 2;
            this.velocityY = 0;
            this.velocityX = 0;

            for (let i = 0; i < 20; i++) {
                this.particles.push(new DustParticle(this.ctx, this.centerX, this.centerY + this.triangleHeight / 2));
            }
        }
    }

    triggerExplosion() {
        this.isExploding = true;
        this.explosionParts = [];

        for (let i = 0; i < 5; i++) {
            this.explosionParts.push({
                x: this.centerX,
                y: this.centerY,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: (Math.random() - 0.5) * 4,
                rotation: Math.random() * 2 * Math.PI
            });
        }

        this.explosionDuration = 60;
    }

    updateExplosion() {
        this.explosionParts.forEach(part => {
            part.x += part.velocityX;
            part.y += part.velocityY;
        });

        this.explosionDuration--;

        if (this.explosionDuration <= 0) {
            this.showGameOverModal();
            this.isExploding = false;
        }
    }

    drawExplosion() {
        this.ctx.fillStyle = "red";
        this.explosionParts.forEach(part => {
            this.ctx.beginPath();
            this.ctx.arc(part.x, part.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    consumeFuel() {
        this.fuel -= this.fuelConsumptionRate;
        if (this.fuel < 0) {
            this.fuel = 0;
        }
    }

    showLandingModal() {
        const modal = document.getElementById('landingModal');
        modal.style.display = 'flex';
    }

    showGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        modal.style.display = 'flex';
    }
}
