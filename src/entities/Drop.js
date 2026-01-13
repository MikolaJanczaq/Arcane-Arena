export class Drop {
    constructor(game, x, y, type = 'xp') {
        this.game = game;
        this.worldX = x;
        this.worldY = y;

        this.type = type;
        if (this.type === 'xp') {
            this.color = '#00FFFF';
            this.value = 10;
            this.radius = 8;
        } else if (this.type === 'gold') {
            this.color = '#FFD700';
            this.value = 1;
            this.radius = 10;
        }

        this.markedForDeletion = false;

        this.isMagnetized = false;
        this.speed = 0;
        this.acceleration = 0.5;
    }

    update() {
        const distToPlayer = Math.hypot(
            this.game.player.worldX - this.worldX,
            this.game.player.worldY - this.worldY
        );

        if (distToPlayer < 150) {
            this.isMagnetized = true;
        }

        if (this.isMagnetized) {
            this.speed += this.acceleration;

            const dx = this.game.player.worldX - this.worldX;
            const dy = this.game.player.worldY - this.worldY;

            const angle = Math.atan2(dy, dx);
            this.worldX += Math.cos(angle) * this.speed;
            this.worldY += Math.sin(angle) * this.speed;

            if (distToPlayer < 20) {
                this.markedForDeletion = true;
                if (this.type === 'xp') {
                    this.game.player.experience += this.value;
                    console.log("XP gained: " + this.game.player.experience);
                } else if (this.type === 'gold') {
                    this.game.player.gold += this.value;
                    console.log("Gold gained: " + this.game.player.gold);
                }
            }
        }
    }

    draw(context) {
        const screenX = (this.worldX - this.game.player.worldX) + this.game.width / 2;
        const screenY = (this.worldY - this.game.player.worldY) + this.game.height / 2;

        context.save();
        context.beginPath();

        if (this.type === 'gold') {
            context.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        } else {
            context.moveTo(screenX, screenY - this.radius);
            context.lineTo(screenX + this.radius, screenY);
            context.lineTo(screenX, screenY + this.radius);
            context.lineTo(screenX - this.radius, screenY);
        }

        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = 'white';
        context.lineWidth = 1;
        context.stroke();
        context.restore();
    }
}