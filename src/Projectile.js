export class Projectile {
    constructor(game, x, y, angle) {
        this.game = game;
        this.worldX = x;
        this.worldY = y;
        this.angle = angle;

        this.speed = 5;
        this.damage = 15;
        this.radius = 6;

        this.markedForDeletion = false;
        this.lifeTimer = 0;
        this.maxLife = 2000;
    }

    update(deltaTime) {
        this.worldX += Math.cos(this.angle) * this.speed;
        this.worldY += Math.sin(this.angle) * this.speed;

        this.lifeTimer += deltaTime;
        if (this.lifeTimer > this.maxLife) this.markedForDeletion = true;

        const nearbyEnemies = this.game.grid.getNearby(this.worldX, this.worldY);

        for (const enemy of nearbyEnemies) {
            const dx = enemy.worldX - this.worldX;
            const dy = enemy.worldY - this.worldY;
            const distance = Math.hypot(dx, dy);

            if (distance < enemy.radius + this.radius) {
                enemy.takeDamage(this.damage);
                this.markedForDeletion = true;
                break;
            }
        }
    }

    draw(context) {
        const screenX = (this.worldX - this.game.player.worldX) + this.game.width / 2;
        const screenY = (this.worldY - this.game.player.worldY) + this.game.height / 2;

        context.beginPath();
        context.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        context.fillStyle = '#00FFFF';
        context.fill();
        context.strokeStyle = 'white';
        context.lineWidth = 1;
        context.stroke();
    }
}