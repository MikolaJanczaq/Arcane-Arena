import {Weapon} from "./Weapon.js";

export class RotatingBlades extends Weapon{
    constructor(game) {
        super(game);
        this.name = "Rotating Blades";
        this.level = 1;

        this.damage = 2;
        this.range = 100;

        this.bladeCount = 2; // lvl 1
        this.angle = 0;
        this.rotationSpeed = 0.02;
        this.bladeRadius = 10;
    }

    update(deltaTime) {
        if (this.game.player.isFrozen) return;

        this.angle += this.rotationSpeed;

        for (let i = 0; i < this.bladeCount; i++) {
            const currentAngle = this.angle + (Math.PI * 2 / this.bladeCount) * i;

            const bladeX = this.game.player.worldX + Math.cos(currentAngle) * this.range;
            const bladeY = this.game.player.worldY + Math.sin(currentAngle) * this.range;

            const nearbyEnemies = this.game.grid.getNearby(bladeX, bladeY);

            nearbyEnemies.forEach(enemy => {
                const dx = enemy.worldX - bladeX;
                const dy = enemy.worldY - bladeY;
                const dist = Math.hypot(dx, dy);

                if (dist < enemy.radius + this.bladeRadius) {
                    enemy.takeDamage(this.damage);
                }
            });
        }
    }

    upgrade() {
        this.level++;
        if (this.level === 2) {
            this.bladeCount = 3;
            this.range = 120;
        } else if (this.level === 3) {
            this.bladeCount = 4;
            this.range = 140;
            this.rotationSpeed += 0.01;
        }
        // console.log("Rotating Blades upgraded to Level " + this.level);
    }

    draw(context) {
        const screenCenterX = this.game.width / 2;
        const screenCenterY = this.game.height / 2;

        for (let i = 0; i < this.bladeCount; i++) {
            const currentAngle = this.angle + (Math.PI * 2 / this.bladeCount) * i;

            const x = screenCenterX + Math.cos(currentAngle) * this.range;
            const y = screenCenterY + Math.sin(currentAngle) * this.range;

            context.beginPath();
            context.arc(x, y, this.bladeRadius, 0, Math.PI * 2);
            context.fillStyle = '#C0C0C0';
            context.fill();
            context.strokeStyle = 'white';
            context.stroke();
        }
    }
}