export class Enemy {
    constructor(game) {
        this.game = game;

        const spawnRadius = this.game.width * 0.7;
        const spawnAngle = Math.random() * Math.PI * 2;
        this.worldX = this.game.player.worldX + Math.cos(spawnAngle) * spawnRadius;
        this.worldY = this.game.player.worldY + Math.sin(spawnAngle) * spawnRadius;

        this.speed = 0.5;
        this.radius = 15;
        this.maxHp = 10;
        this.hp = this.maxHp;
        this.xpValue = 10;

        this.width = 64;
        this.height = 64;

        this.markedForDeletion = false;
        this.facing = 0;
        this.sprite = null;

        this.directionMap = {
            down: 0,
            up: 1,
            right: 2,
            left: 3
        };
    }

    updateFacing(dx, dy) {
        if (Math.abs(dx) > Math.abs(dy)) {
            // horizontal
            if (dx > 0) this.facing = this.directionMap.right;
            else this.facing = this.directionMap.left;
        } else {
            // vertical
            if (dy > 0) this.facing = this.directionMap.down;
            else this.facing = this.directionMap.up;
        }
    }

    update(deltaTime) {
        const dx = this.game.player.worldX - this.worldX;
        const dy = this.game.player.worldY - this.worldY;
        const distance = Math.hypot(dx, dy);

        if (distance > 0) {
            this.worldX += dx / distance * this.speed;
            this.worldY += dy / distance * this.speed;
        }

        if (this.sprite) {
            this.sprite.update(deltaTime || 16);
        }

        this.updateFacing(dx, dy);

        if (this.sprite) {
            this.sprite.frameY = this.facing;
        }
    }

    draw(context) {
        if (!this.sprite) return;

        const screenX = (this.worldX - this.game.player.worldX) + this.game.width / 2;
        const screenY = (this.worldY - this.game.player.worldY) + this.game.height / 2;

        if (screenX < -100 || screenX > this.game.width + 100 ||
            screenY < -100 || screenY > this.game.height + 100) {
            return;
        }

        this.sprite.draw(context, screenX, screenY, this.width, this.height);

        if (this.hp < this.maxHp) {
            this.drawHealthBar(context, screenX, screenY);
        }
    }

    drawHealthBar(context, x, y) {
        context.save();
        context.fillStyle = 'red';
        context.fillRect(x - 15, y - 40, 30, 4);
        context.fillStyle = '#00ff00';
        context.fillRect(x - 15, y - 40, 30 * (this.hp / this.maxHp), 4);
        context.restore();
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.markedForDeletion = true;
        this.game.spawnDrop(this.worldX, this.worldY, 'xp', this.xpValue);
        if (Math.random() < 0.2) {
            this.game.spawnDrop(this.worldX + 5, this.worldY + 5, 'gold');
        }
    }
}