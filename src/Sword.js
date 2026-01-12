import {Weapon} from "./Weapon.js";

export class Sword extends Weapon {
    constructor(game) {
        super(game);

        this.damage = 25;
        this.range = 60;
        this.cooldown = 1000;

        this.isAttacking = false;
        this.attactDuration = 200;
        this.attackTimer = 0;
        this.attackAngle = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);

        if (this.isAttacking) {
            this.attackTimer += deltaTime;
            if (this.attackTimer > this.attactDuration) {
                this.isAttacking = false;
            }
        }
    }

    attack(target) {
        if (this.game.player.isFrozen) return;
        this.isAttacking = true;
        this.attackTimer = 0;

        const dx = target.worldX - this.game.player.worldX;
        const dy = target.worldY - this.game.player.worldY;
        this.attackAngle = Math.atan2(dy, dx);

        const potentialTargets = this.game.grid.getNearby(this.game.player.worldX, this.game.player.worldY);

        potentialTargets.forEach(enemy => {
            if (this.checkHit(enemy)) {
                enemy.takeDamage(this.damage);
            }
        });
    }

    draw(context) {
        if (!this.isAttacking) return;

        const screenX = this.game.width /2 ;
        const screenY = this.game.height / 2;

        context.save();
        context.translate(screenX, screenY);
        context.rotate(this.attackAngle);

        context.beginPath();
        context.moveTo(0,0);
        context.arc(0,0, this.range, 0.8, 0.8);
        context.closePath();

        context.fillStyle = 'rgba(255, 255, 0, 0.5)';
        context.fill();
        context.strokeStyle = 'white';
        context.stroke();

        context.restore();
    }

    checkHit(enemy) {
        const dx = enemy.worldX - this.game.player.worldX;
        const dy = enemy.worldY - this.game.player.worldY;
        const distance = Math.hypot(dx, dy);

        if (distance > this.range + enemy.radius) return false;

        const angleToEnemy = Math.atan2(dy,dx);
        let angleDiff = angleToEnemy - this.attackAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        return Math.abs(angleDiff) < 1.0;
    }
}