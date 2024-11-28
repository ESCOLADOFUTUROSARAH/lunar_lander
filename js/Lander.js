// Importação do módulo DustParticle
import { DustParticle } from './DustParticle.js';

export class Lander {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        // Propriedades da nave
        this.triangleHeight = 25;
        this.triangleBase = 25;
        this.resetPosition();

        // Física
        this.gravity = 0.027;
        this.maxLandingSpeed = 2;
        this.maxVelocityX = 5;

        // Combustível
        this.fuel = 100;
        this.maxFuel = 100;
        this.fuelConsumptionRate = 0.2;

        // Estados do jogo
        this.hasLanded = false;
        this.isExploding = false;
        this.explosionParts = [];
        this.explosionDuration = 60;

        // Controles
        this.keys = { ArrowUp: false, ArrowLeft: false, ArrowRight: false };

        // Partículas
        this.particles = [];

        // Referências aos modais
        this.landingModal = document.getElementById('landingModal');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.finalGameOverModal = document.getElementById('finalGameOverModal');
    }

    // Desenha a nave e elementos relacionados
    draw() {
        const { ctx, centerX, centerY, triangleHeight, triangleBase } = this;

        if (this.isExploding) {
            this.drawExplosion();
        } else {
            // Desenhar a nave
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

            // Desenhar chamas dos propulsores
            ctx.fillStyle = "orange";
            if (this.keys.ArrowUp && this.fuel > 0) {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + triangleHeight / 2);
                ctx.lineTo(centerX - 5, centerY + triangleHeight / 2 + 15);
                ctx.lineTo(centerX + 5, centerY + triangleHeight / 2 + 15);
                ctx.closePath();
                ctx.fill();
            }
            if (this.keys.ArrowLeft && !this.hasLanded && this.fuel > 0) {
                ctx.beginPath();
                ctx.moveTo(centerX + triangleBase / 2, centerY);
                ctx.lineTo(centerX + triangleBase / 2 + 15, centerY - 5);
                ctx.lineTo(centerX + triangleBase / 2 + 15, centerY + 5);
                ctx.closePath();
                ctx.fill();
            }
            if (this.keys.ArrowRight && !this.hasLanded && this.fuel > 0) {
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

        // Desenhar partículas
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Remover partículas que não estão mais visíveis
        this.particles = this.particles.filter(particle => particle.isVisible());
    }

    // Desenha a barra de combustível
    drawFuelBar() {
        const barWidth = 200;
        const barHeight = 20;
        const margin = 20;
        const fuelPercentage = this.fuel / this.maxFuel;

        this.ctx.fillStyle = "white";
        this.ctx.font = "10px Arial";
        this.ctx.fillText("NÍVEL DE COMBUSTÍVEL", margin, margin - 5);

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(margin, margin, barWidth, barHeight);

        this.ctx.fillStyle = fuelPercentage > 0.2 ? "orange" : "red";
        this.ctx.fillRect(margin, margin, barWidth * fuelPercentage, barHeight);
    }

    // Atualiza o estado da nave
    update() {
        if (this.isExploding) {
            this.updateExplosion();
            return;
        }

        if (this.hasLanded && !this.keys.ArrowUp) {
            this.showLandingModal();
            return;
        }

        // Aplicar gravidade
        if (!this.hasLanded) {
            this.velocityY += this.gravity * 0.1;
        }
        this.centerY += this.velocityY;

        // Controle vertical
        if (this.keys.ArrowUp && this.fuel > 0) {
            this.velocityY -= this.gravity * 0.3;
            this.consumeFuel();
            this.emitParticles();
        }

        // Controle horizontal
        if (this.keys.ArrowLeft && !this.hasLanded && this.fuel > 0) {
            this.velocityX -= this.gravity * 0.2;
            this.consumeFuel();
            this.emitParticles();
        }
        if (this.keys.ArrowRight && !this.hasLanded && this.fuel > 0) {
            this.velocityX += this.gravity * 0.2;
            this.consumeFuel();
            this.emitParticles();
        }

        // Limitar a velocidade horizontal
        this.velocityX = Math.max(Math.min(this.velocityX, this.maxVelocityX), -this.maxVelocityX);
        this.centerX += this.velocityX;

        // Manter dentro dos limites do canvas
        this.keepWithinBounds();

        // Verificar colisão com o chão
        if (this.centerY + this.triangleHeight / 2 >= this.canvas.height) {
            if (Math.abs(this.velocityY) > this.maxLandingSpeed) {
                this.triggerExplosion();
                this.showGameOverModal();
                return;
            }

            this.hasLanded = true;
            this.centerY = this.canvas.height - this.triangleHeight / 2;
            this.velocityY = 0;
            this.velocityX = 0;

            // Emitir partículas de pouso
            for (let i = 0; i < 20; i++) {
                this.particles.push(new DustParticle(this.ctx, this.centerX, this.centerY + this.triangleHeight / 2));
            }
        }

        // Verificar se o combustível acabou
        if (this.fuel <= 0 && !this.hasLanded) {
            this.triggerExplosion();
            this.showGameOverModal();
        }
    }

    // Emitir partículas ao usar os propulsores
    emitParticles() {
        this.particles.push(new DustParticle(this.ctx, this.centerX, this.centerY + this.triangleHeight / 2));
    }

    // Manter a nave dentro dos limites do canvas
    keepWithinBounds() {
        if (this.centerX - this.triangleBase / 2 < 0) {
            this.centerX = this.triangleBase / 2;
            this.velocityX = 0;
        } else if (this.centerX + this.triangleBase / 2 > this.canvas.width) {
            this.centerX = this.canvas.width - this.triangleBase / 2;
            this.velocityX = 0;
        }
        if (this.centerY - this.triangleHeight / 2 < 0) {
            this.centerY = this.triangleHeight / 2;
            this.velocityY = 0;
        }
    }

    // Inicia a explosão
    triggerExplosion() {
        this.isExploding = true;
        this.explosionParts = [];

        for (let i = 0; i < 20; i++) {
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

    // Atualiza a explosão
    updateExplosion() {
        this.explosionParts.forEach(part => {
            part.x += part.velocityX;
            part.y += part.velocityY;
        });

        this.explosionDuration--;

        if (this.explosionDuration <= 0) {
            this.isExploding = false;
            this.showFinalGameOverModal();
        }
    }

    // Desenha a explosão
    drawExplosion() {
        this.ctx.fillStyle = "red";
        this.explosionParts.forEach(part => {
            this.ctx.beginPath();
            this.ctx.arc(part.x, part.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    // Consome o combustível
    consumeFuel() {
        this.fuel -= this.fuelConsumptionRate;
        if (this.fuel < 0) {
            this.fuel = 0;
        }
    }

    // Reinicia a posição da nave
    resetPosition() {
        this.centerX = this.canvas.width / 2;
        this.centerY = 50;
        this.velocityX = 0;
        this.velocityY = 0;
        this.hasLanded = false;
        this.isExploding = false;
        this.explosionParts = [];
        this.particles = [];
        this.fuel = this.maxFuel;
    }

    // Exibe o modal de aterrissagem bem-sucedida
    showLandingModal() {
        this.landingModal.classList.add('show');
    }

    // Exibe o modal de game over
    showGameOverModal() {
        this.gameOverModal.classList.add('show');
    }

    // Exibe o modal de game over final
    showFinalGameOverModal() {
        this.finalGameOverModal.classList.add('show');
    }
}