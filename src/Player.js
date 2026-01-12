import { Sprite } from "./Sprite.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.worldX = 0;
        this.worldY = 0;

        this.speed = 1 ;
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

        this.isFrozen = false;
        this.shakesNeeded = 5;
        this.currentShakes = 0;

        const frameSize = 64;

        this.spriteWalk = new Sprite(this.game, this.game.playerImage, frameSize, frameSize);
        this.spriteAttack = new Sprite(this.game, this.game.playerAttackImage, frameSize, frameSize);

        this.spriteAttack.fps = 20;
        this.spriteAttack.frameInterval = 1000 / 20;
    }

    update(input, deltatime) {
        if (this.isFrozen) {
            const shakesDone = input.shakeCount - this.startShakeCount;
            if (shakesDone >= this.shakesNeeded) {
                this.unfreeze();
            }

            this.spriteWalk.frameX = 0;
            this.spriteAttack.frameX = 0;
            return;
        }

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
            }
        }
    }

    applyFreeze() {
        if (this.isFrozen || this.invulnerable) return;
        this.isFrozen = true;
        console.log("Player frozen Shake device or press space")
        this.startShakeCount = this.game.input.shakeCount;
    }

    unfreeze() {
        this.isFrozen = false;
        console.log("Player unfrozen")
        this.invulnerable = true;
        this.invulnerableTimer = 0;
    }

    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.2);
        this.hp = this.maxHp;
        console.log("Level Up! Level: " + this.level);
        this.game.triggerLevelUp();
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

        if (this.isFrozen) {
            context.save();
            context.beginPath();
            context.arc(screenX, screenY, 30, 0, Math.PI*2);
            context.fillStyle = 'rgba(0, 100, 255, 0.5)';
            context.fill();
            context.restore();
        }

        if (this.invulnerable) context.globalAlpha = 0.5;

        const isAttacking = this.game.weapons[0] && this.game.weapons[0].isAttacking;

        if (isAttacking && !this.isFrozen) {
            this.spriteAttack.draw(context, screenX, screenY, 100, 100);
        } else {
            this.spriteWalk.draw(context, screenX, screenY, 100, 100);
        }

        context.globalAlpha = 1;

        if (this.isFrozen) {
            context.save();
            context.fillStyle = 'white';
            context.font = '20px Arial';
            context.textAlign = 'center';
            context.fillText("SHAKE!", screenX, screenY - 50);

            const shakes = this.game.input.shakeCount - this.startShakeCount;
            const percent = Math.min(shakes / this.shakesNeeded, 1);

            context.fillStyle = 'black';
            context.fillRect(screenX - 20, screenY - 45, 40, 5);
            context.fillStyle = '#00FFFF';
            context.fillRect(screenX - 20, screenY - 45, 40 * percent, 5);
            context.restore();
        }
    }
}