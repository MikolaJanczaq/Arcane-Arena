import {Weapon} from "./Weapon.js";
import {Projectile} from "./Projectile.js";

export class MagicWand extends Weapon {
    constructor(game) {
        super(game);
        this.name = "Magic Wand";
        this.level = 1;

        this.damage = 15;
        this.cooldown = 1200;
    }

    update(deltaTime) {
        if (this.game.player.isFrozen) return;

        if (this.timer < this.cooldown) {
            this.timer += deltaTime;
            return;
        }

        this.fire();
        this.timer = 0;
    }

    fire() {
        const x = this.game.player.worldX;
        const y = this.game.player.worldY;

        this.game.projectiles.push(new Projectile(this.game, x, y, -Math.PI / 2));

        // shoot up
        this.game.projectiles.push(new Projectile(this.game, x, y, -Math.PI / 2));

        // shoot down
        if (this.level >= 2) {
            this.game.projectiles.push(new Projectile(this.game, x, y, Math.PI / 2));
        }

        // shoot left and right
        if (this.level >= 3) {
            this.game.projectiles.push(new Projectile(this.game, x, y, 0));
            this.game.projectiles.push(new Projectile(this.game, x, y, Math.PI));
        }
    }

    upgrade() {
        this.level++;
        this.cooldown *= 0.85;
        console.log("Magic Wand upgraded to Level " + this.level + "!")
    }

    draw(context) {}
}