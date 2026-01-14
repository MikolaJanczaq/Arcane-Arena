export class Enemy {
    constructor(game) {
        this.game = game;

        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 20;

        while (!validPosition && attempts < maxAttempts) {
            const spawnRadius = this.game.width * 0.7;
            const spawnAngle = Math.random() * Math.PI * 2;

            const candidateX = this.game.player.worldX + Math.cos(spawnAngle) * spawnRadius;
            const candidateY = this.game.player.worldY + Math.sin(spawnAngle) * spawnRadius;

            if (!this.game.collisionMap.isObstacle(candidateX, candidateY)) {
                this.worldX = candidateX;
                this.worldY = candidateY;
                validPosition = true;
            }

            attempts++;
        }

        this.difficultyMultiplier = 1 + ((this.game.worldLevel - 1) * 0.2);

        this.speed = 0.5 + (this.game.worldLevel * 0.05);
        this.radius = 15;
        this.maxHp = 10 * this.difficultyMultiplier;
        this.hp = this.maxHp;
        this.xpValue = 10;

        this.width = 64;
        this.height = 64;

        this.markedForDeletion = false;
        this.facing = 0;
        this.sprite = null;

        this.checkCollision = false;
        this.randomPhase = Math.random() * Math.PI * 2;

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
        const rawDx = this.game.player.worldX - this.worldX;
        const rawDy = this.game.player.worldY - this.worldY;
        const distance = Math.hypot(rawDx, rawDy);

        this.updateFacing(rawDx, rawDy);

        if (distance > 0) {
            let angle = Math.atan2(rawDy, rawDx);

            if (this.checkCollision) {
                const wobbleStrength = distance > 100 ? 0.8 : 0.2;
                angle += Math.sin(this.game.levelTimer * 0.003 + this.randomPhase) * wobbleStrength;
            }

            const velocityX = Math.cos(angle) * this.speed;
            const velocityY = Math.sin(angle) * this.speed;

            if (this.checkCollision) {
                const offsetX = Math.sign(velocityX) * (this.radius * 0.5);
                const offsetY = Math.sign(velocityY) * (this.radius * 0.5);

                const nextX = this.worldX + velocityX;
                if (!this.game.collisionMap.isObstacle(nextX + offsetX, this.worldY)) {
                    this.worldX += velocityX;
                }

                const nextY = this.worldY + velocityY;
                if (!this.game.collisionMap.isObstacle(this.worldX, nextY + offsetY)) {
                    this.worldY += velocityY;
                }
            } else {
                this.worldX += velocityX;
                this.worldY += velocityY;
            }
        }

        if (this.sprite) {
            this.sprite.update(deltaTime || 16);
        }

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