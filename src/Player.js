import { Sprite } from "./Sprite.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.worldX = 0;
        this.worldY = 0;

        this.speed = 3;
        this.radius = 20;

        this.experience = 0;
        this.experienceToNextLevel = 100;
        this.gold = 0;
        this.level = 1;

        this.maxHp = 100;
        this.hp = this.maxHp;

        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.invulnerableInterval = 500;

        const frameSize = 64;

        this.spriteWalk = new Sprite(this.game, this.game.playerImage, frameSize, frameSize);
        this.spriteAttack = new Sprite(this.game, this.game.playerAttackImage, frameSize, frameSize);

        this.spriteAttack.fps = 20;
        this.spriteAttack.frameInterval = 1000 / 20;
    }

    update(input, deltatime) {
        if (input.x !== 0 || input.y !== 0) {
            this.worldX += input.x * this.speed;
            this.worldY += input.y * this.speed;
        }

        let direction = this.spriteWalk.frameY;

        if (Math.abs(input.x) > Math.abs(input.y)) {
            if (input.x > 0) direction = 2; // right
            else direction = 1;             // left
        } else if (Math.abs(input.y) > 0) {
            if (input.y > 0) direction = 0; // down
            else if (input.y < 0) direction = 3; // up
        }

        this.spriteWalk.frameY = direction;
        this.spriteAttack.frameY = direction;

        const isAttacking = this.game.weapons[0] && this.game.weapons[0].isAttacking;

        if (isAttacking) {
            this.spriteAttack.update(deltatime);
        } else {
            this.spriteAttack.frameX = 0;

            if (input.x !== 0 || input.y !== 0) {
                this.spriteWalk.update(deltatime);
            } else {
                this.spriteWalk.frameX = 0;
            }
        }

        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }

        if (this.invulnerable) {
            this.invulnerableTimer += deltatime;
            if (this.invulnerableTimer > this.invulnerableInterval) {
                this.invulnerable = false;
                this.invulnerableTimer = 0;
                this.color = 'gold';
            }
        }
    }

    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.2);
        this.hp = this.maxHp;
        console.log("Level Up! Level: " + this.level);
    }

    takeDamage(amount) {
        if (this.invulnerable) return;

        this.hp -= amount;
        this.invulnerable = true;
        if (this.hp <= 0) {
            this.game.gameOver = true;
        }
    }

    draw(context) {
        const screenX = this.game.width / 2;
        const screenY = this.game.height / 2;
        if (this.invulnerable) context.globalAlpha = 0.5;

        const isAttacking = this.game.weapons[0] && this.game.weapons[0].isAttacking;

        if (isAttacking) {
            this.spriteAttack.draw(context, screenX, screenY, 100, 100);
        } else {
            this.spriteWalk.draw(context, screenX, screenY, 100, 100);
        }

        context.globalAlpha = 1;
    }
}