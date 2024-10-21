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
        this.isExploding = false; // Novo estado para controlar a explosão
        this.explosionParts = [];
        this.explosionDuration = 60; // Duração da animação de explosão (em frames)
        this.fuel = 100;
        this.maxFuel = 100;
        this.fuelConsumptionRate = 0.2;
        this.maxLandingSpeed = 2;
        this.keys = {
            ArrowUp: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.particles = [];
    }

    draw() {
        const { ctx, centerX, centerY, triangleHeight, triangleBase } = this;

        if (this.isExploding) {
            this.drawExplosion();  // Desenhar a explosão quando a nave estiver explodindo
        } else {
            // Desenhar o lander normalmente
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
        }

        // Desenhar as partículas de poeira
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        this.particles = this.particles.filter(particle => particle.isVisible());

        // Desenhar boosters
        if (!this.isExploding) {
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
    }

    drawFuelBar() {
        const barWidth = 200;
        const barHeight = 20;
        const margin = 20;
        const fuelPercentage = this.fuel / this.maxFuel;

        // Desenhar o texto "Nível de Combustível"
        this.ctx.fillStyle = "white";
        this.ctx.font = "10px Arial";
        this.ctx.fillText("Nível de Combustível".toUpperCase(), margin, margin - 5);

        // Desenhar a borda da barra
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(margin, margin, barWidth, barHeight);

        // Desenhar a barra de combustível
        this.ctx.fillStyle = "orange";
        this.ctx.fillRect(margin, margin, barWidth * fuelPercentage, barHeight);
    }

    update() {
        if (this.isExploding) {
            this.updateExplosion();  // Atualizar a animação da explosão
            return;  // Se estiver explodindo, não atualizar o movimento normal
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

        this.centerX += this.velocityX;

        // Verificar se aterrissou
        if (this.centerY + this.triangleHeight / 2 > this.canvas.height) {
            // Verificar velocidade antes de zerar
            if (Math.abs(this.velocityY) > this.maxLandingSpeed) {
                this.triggerExplosion();  // Iniciar a explosão
                return;  // Não mostrar mais a modal de aterrissagem bem-sucedida
            }

            // Aterrissagem bem-sucedida
            this.hasLanded = true;
            this.showLandingModal();  // Exibir modal de sucesso na aterrissagem

            // Agora zera a velocidade depois da verificação
            this.centerY = this.canvas.height - this.triangleHeight / 2;
            this.velocityY = 0;
            this.velocityX = 0;

            // Gerar partículas de poeira
            for (let i = 0; i < 20; i++) {
                this.particles.push(new DustParticle(this.ctx, this.centerX, this.centerY + this.triangleHeight / 2));
            }
        }
    }

    triggerExplosion() {
        this.isExploding = true;
        this.explosionParts = [];

        // Dividir a nave em 5 pedaços para a explosão
        for (let i = 0; i < 5; i++) {
            this.explosionParts.push({
                x: this.centerX,
                y: this.centerY,
                velocityX: (Math.random() - 0.5) * 4,  // Velocidade aleatória para os lados
                velocityY: (Math.random() - 0.5) * 4,  // Velocidade aleatória para cima/baixo
                rotation: Math.random() * 2 * Math.PI  // Rotação aleatória
            });
        }

        this.explosionDuration = 60;  // A animação de explosão durará 60 frames
    }

    updateExplosion() {
        this.explosionParts.forEach(part => {
            part.x += part.velocityX;
            part.y += part.velocityY;
        });

        // Diminuir a duração da explosão até o fim
        this.explosionDuration--;

        // Quando a explosão terminar, exibir a modal de Game Over
        if (this.explosionDuration <= 0) {
            this.showGameOverModal();
            this.isExploding = false;
        }
    }

    drawExplosion() {
        this.ctx.fillStyle = "red";
        this.explosionParts.forEach(part => {
            this.ctx.beginPath();
            this.ctx.arc(part.x, part.y, 5, 0, Math.PI * 2);  // Desenhar os pedaços da nave como pequenos círculos
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
        modal.style.display = 'flex'; // Exibir a modal de aterrissagem
    }

    showGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        modal.style.display = 'flex'; // Exibir a modal de "Game Over"
    }
}

