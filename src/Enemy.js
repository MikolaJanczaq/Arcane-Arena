export class Enemy {
    constructor(game) {
        this.game = game;

        const spawnRadius = this.game.width * 0.7;
        const spawnAngle = Math.random() * Math.PI * 2;

        this.worldX = this.game.player.worldX + Math.cos(spawnAngle) * spawnRadius;
        this.worldY = this.game.player.worldY + Math.sin(spawnAngle) * spawnRadius;

        this.speed = 0.5;
        this.radius = 15;
        this.color = 'red'

        this.maxHp = 30;
        this.hp = this.maxHp;

        this.damage = 10;

        this.markedForDeletion = false;
    }

    update() {
        const dx = this.game.player.worldX - this.worldX;
        const dy = this.game.player.worldY - this.worldY;
        const distance = Math.hypot(dx, dy);

        if (distance > 0) {
            this.worldX += dx / distance * this.speed;
            this.worldY += dy / distance * this.speed;
        }
    }

    draw(context) {
        const screenX = (this.worldX - this.game.player.worldX) + this.game.width / 2;
        const screenY = (this.worldY - this.game.player.worldY) + this.game.height / 2;

        //TODO dont draw object that are not on the scree for better optimization

        context.save();
        context.beginPath();
        context.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = 'black';
        context.stroke();

        if (this.hp < this.maxHp) {
            context.fillStyle = 'red';
            context.fillRect(screenX - 10, screenY - 25, 20,4);
            context.fillStyle = '#00ff00';
            context.fillRect(screenX - 10, screenY - 25, 20 * (this.hp / this.maxHp), 4);
        }

        context.restore();
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.markedForDeletion = true;
            this.game.spawnDrop(this.worldX, this.worldY);
        }
    }
}