import { DustParticle } from './DustParticle.js';

export class Lander {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.triangleHeight = 25;  // Altura da nave
        this.triangleBase = 25;    // Base da nave
        this.centerX = canvas.width / 2;  // Posição inicial X (meio do canvas)
        this.centerY = 50;                 // Posição inicial Y (no topo do canvas)
        this.gravity = 0.162;             // Gravidade da Lua (ajustável para outros planetas)
        this.velocityY = 0;               // Velocidade vertical inicial
        this.velocityX = 0;               // Velocidade horizontal inicial
        this.hasLanded = false;           // Status da aterrissagem
        this.isExploding = false;         // Estado para controlar a explosão
        this.explosionParts = [];         // Pedaços da nave para a explosão
        this.explosionDuration = 60;      // Duração da animação de explosão (em frames)
        this.fuel = 100;                  // Quantidade inicial de combustível
        this.maxFuel = 100;               // Capacidade máxima de combustível
        this.fuelConsumptionRate = 0.2;   // Taxa de consumo de combustível
        this.maxLandingSpeed = 2;         // Velocidade máxima permitida para uma aterrissagem bem-sucedida
        this.maxVelocityX = 5;            // Limite de velocidade horizontal (adicionado)
        this.keys = {                     // Controles do teclado
            ArrowUp: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.particles = [];  // Partículas de poeira para efeito visual
    }

    // Método para desenhar o lander
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

            // Desenhar boosters (propulsores) se a nave não estiver explodindo
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

            // Só desenhar a barra de combustível se a nave não estiver explodindo
            if (!this.isExploding) {
                this.drawFuelBar();
            }
        }

        // Desenhar as partículas de poeira
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Filtrar as partículas que ainda são visíveis
        this.particles = this.particles.filter(particle => particle.isVisible());
    }


    // Método para desenhar a barra de combustível
    drawFuelBar() {
        const barWidth = 200;
        const barHeight = 20;
        const margin = 20;
        const fuelPercentage = this.fuel / this.maxFuel;

        // Desenhar o texto "Nível de Combustível"
        this.ctx.fillStyle = "white";
        this.ctx.font = "10px Arial";
        this.ctx.fillText("Nível de Combustível".toUpperCase(), margin, margin - 5);

        // Desenhar a borda da barra de combustível
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(margin, margin, barWidth, barHeight);

        // Desenhar a barra de combustível com cor variável dependendo do nível
        this.ctx.fillStyle = fuelPercentage > 0.2 ? "orange" : "red";  // Vermelho se o combustível estiver baixo
        this.ctx.fillRect(margin, margin, barWidth * fuelPercentage, barHeight);
    }

    // Método para atualizar a posição da nave e verificar aterrissagem ou explosão
    update() {
        if (this.isExploding) {
            this.updateExplosion();  // Atualizar a animação de explosão
            return;  // Se explodindo, não atualizar o movimento normal
        }

        if (this.hasLanded && !this.keys.ArrowUp) return;  // Se pousou e não está tentando decolar, não atualizar

        if (!this.hasLanded) {
            this.velocityY += this.gravity * 0.1;  // Aplicar gravidade para acelerar a descida
        }
        this.centerY += this.velocityY;  // Atualizar a posição vertical

        // Controle do booster para subir
        if (this.keys.ArrowUp && this.fuel > 0) {
            if (this.hasLanded) {
                this.hasLanded = false;
                this.velocityY = -this.gravity * 1.5;  // Decolar com força
            } else {
                this.velocityY -= this.gravity * 0.3;  // Subir se ainda não pousou
            }
            this.consumeFuel();  // Consome combustível ao usar o propulsor
        }

        // Controle dos boosters laterais
        if (this.keys.ArrowLeft && !this.hasLanded && this.fuel > 0) {
            this.velocityX -= this.gravity * 0.2;  // Mover para a esquerda
            this.consumeFuel();
        }
        if (this.keys.ArrowRight && !this.hasLanded && this.fuel > 0) {
            this.velocityX += this.gravity * 0.2;  // Mover para a direita
            this.consumeFuel();
        }

        // Limitar a velocidade horizontal
        this.velocityX = Math.max(Math.min(this.velocityX, this.maxVelocityX), -this.maxVelocityX);  // Limite de velocidade horizontal

        this.centerX += this.velocityX;  // Atualizar a posição horizontal

        // Verificar se aterrissou
        if (this.centerY + this.triangleHeight / 2 > this.canvas.height) {
            if (Math.abs(this.velocityY) > this.maxLandingSpeed) {
                this.triggerExplosion();  // Explodir se a velocidade for muito alta
                return;
            }

            // Aterrissagem bem-sucedida
            this.hasLanded = true;
            this.showLandingModal();  // Exibir modal de sucesso na aterrissagem

            // Ajustar a posição final e zerar as velocidades
            this.centerY = this.canvas.height - this.triangleHeight / 2;
            this.velocityY = 0;
            this.velocityX = 0;

            // Gerar partículas de poeira no pouso
            for (let i = 0; i < 20; i++) {
                this.particles.push(new DustParticle(this.ctx, this.centerX, this.centerY + this.triangleHeight / 2));
            }
        }
    }

    // Método para iniciar a explosão
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

    // Método para atualizar a explosão
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

    // Método para desenhar a explosão
    drawExplosion() {
        this.ctx.fillStyle = "red";  // Cor dos fragmentos da explosão
        this.explosionParts.forEach(part => {
            this.ctx.beginPath();
            this.ctx.arc(part.x, part.y, 5, 0, Math.PI * 2);  // Desenhar os pedaços da nave como pequenos círculos
            this.ctx.fill();
        });
    }

    // Método para consumir combustível ao usar os boosters
    consumeFuel() {
        this.fuel -= this.fuelConsumptionRate;
        if (this.fuel < 0) {
            this.fuel = 0;  // Evitar valores negativos de combustível
        }
    }

    // Mostrar a modal de aterrissagem bem-sucedida
    showLandingModal() {
        const modal = document.getElementById('landingModal');
        modal.style.display = 'flex';  // Exibir a modal de aterrissagem
    }

    // Mostrar a modal de Game Over
    showGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        modal.style.display = 'flex';  // Exibir a modal de "Game Over"
    }
}
