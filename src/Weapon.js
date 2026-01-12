export class Weapon {
    constructor(game) {
        this.game = game;

        this.damage = 10;
        this.cooldown = 1000;
        this.range = 200;

        this.timer = 0;
    }

    update(deltaTime) {
        if (this.timer < this.cooldown) {
            this.timer += deltaTime;
            return;
        }

        const target = this.findNearestEnemy();
        if (target) {
            this.attack(target);
            this.timer = 0;
        }
    }

    // virtual methods
    draw(context){}
    attack(target) {}

    findNearestEnemy() {
        let nearestEnemy = null;
        let minDistance = Infinity;

        this.game.enemies.forEach(enemy => {
            const dx = enemy.worldX - this.game.player.worldX;
            const dy = enemy.worldY - this.game.player.worldY;
            const distance = Math.hypot(dx, dy);

            if (distance < minDistance && distance < this.range) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        });
        return nearestEnemy;
    }
}