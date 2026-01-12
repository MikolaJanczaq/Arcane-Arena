import {Sprite} from "./Sprite.js";

export class Enemy {
    constructor(game, image) {
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

        this.sprite = new Sprite(this.game, image, 32, 32);
    }

    update(deltaTime) {
        const dx = this.game.player.worldX - this.worldX;
        const dy = this.game.player.worldY - this.worldY;
        const distance = Math.hypot(dx, dy);

        if (distance > 0) {
            this.worldX += dx / distance * this.speed;
            this.worldY += dy / distance * this.speed;
        }

        if (this.sprite.update) {
            this.sprite.update(deltaTime || 16);
        }

        let direction = 0;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) direction = 2; // right
            else direction = 3;        // left
        } else {
            if (dy > 0) direction = 0; //down
            else direction = 1;        //up
        }

        this.sprite.frameY = direction;
    }

    draw(context) {
        const screenX = (this.worldX - this.game.player.worldX) + this.game.width / 2;
        const screenY = (this.worldY - this.game.player.worldY) + this.game.height / 2;

        this.sprite.draw(context, screenX, screenY, 64, 64);

        //TODO dont draw object that are not on the scree for better optimization

        if (this.hp < this.maxHp) {
            context.save();
            context.fillStyle = 'red';
            context.fillRect(screenX - 15, screenY - 40, 30, 4);
            context.fillStyle = '#00ff00';
            context.fillRect(screenX - 15, screenY - 40, 30 * (this.hp / this.maxHp), 4);
            context.restore();
        }
        // Debug Hitbox
        // context.beginPath();
        // context.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        // context.stroke();
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.markedForDeletion = true;
            this.game.spawnDrop(this.worldX, this.worldY);
        }
    }
}