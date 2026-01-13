import {Sprite} from "../graphics/Sprite.js";

export class Boss {
    constructor(game) {
        this.game = game;

        this.worldX = this.game.player.worldX + 400;
        this.worldY = this.game.player.worldY;

        this.speed = 0.6;
        this.radius = 40;
        this.hp = 500 + (this.game.level * 200);
        this.maxHp = this.hp;
        this.damage = 0;
        this.attackDamage = 20;

        const frameWidth = 32;
        const frameHeight = 32;

        this.imageRun = new Image();
        this.imageRun.src = "assets/enemies/Boar/Boar_Run.png";

        this.imageAttack = new Image();
        this.imageAttack.src = "assets/enemies/Boar/Boar_Attack.png";

        this.imageDeath = new Image();
        this.imageDeath.src = "assets/enemies/Boar/Boar_Death.png";

        this.spriteRun = new Sprite(this.game, this.imageRun, frameWidth, frameHeight);
        this.spriteAttack = new Sprite(this.game, this.imageAttack, frameWidth, frameHeight);
        this.spriteDeath = new Sprite(this.game, this.imageDeath, frameWidth, frameHeight);

        this.spriteRun.fps = 10;
        this.spriteRun.maxFrame = 4;
        this.spriteAttack.fps = 10;
        this.spriteAttack.maxFrame = 4;
        this.spriteDeath.loop = false;
        this.spriteDeath.maxFrame = 5;

        this.state = 'chase'; // chase, attack, dead
        this.attackRange = 70;
        this.attackCooldown = 1500;
        this.attackTimer = 0;
        this.markedForDeletion = false;

        this.facing = 0 // 0 down 1 up 2 left 3 right
    }

    update(deltaTime) {
        if (this.state === 'dead') {
            this.spriteDeath.frameY = this.facing;
            this.spriteDeath.update(deltaTime);
            return;
        }

        const dx = this.game.player.worldX - this.worldX;
        const dy = this.game.player.worldY - this.worldY;
        const distance = Math.hypot(dx, dy);

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) this.facing = 3; // right
            else this.facing = 2;        // left
        } else {
            if (dy > 0) this.facing = 0; // down
            else this.facing = 1;        // up
        }

        if (this.state === 'attack') {
            this.spriteAttack.frameY = this.facing;
            this.spriteAttack.update(deltaTime);

            if (this.spriteAttack.frameX === 3 && !this.hasDealtDamage) {
                if (distance < this.attackRange + 40) {
                    this.game.player.takeDamage(this.attackDamage);
                }
                this.hasDealtDamage = true;
            }

            if (this.spriteAttack.frameX >= 4) {
                this.state = 'chase';
                this.attackTimer = 0;
            }
        }
        else if (this.state === 'chase') {
            if (distance > this.attackRange) {
                if (distance > 0) {
                    this.worldX += (dx / distance) * this.speed;
                    this.worldY += (dy / distance) * this.speed;
                }

                this.spriteRun.frameY = this.facing;
                this.spriteRun.update(deltaTime);
            } else {
                if (this.attackTimer > this.attackCooldown) {
                    this.startAttack();
                } else {
                    this.attackTimer += deltaTime;
                    this.spriteRun.frameX = 0;
                }
            }
        }

        if (this.game.arena) {
            this.worldX = Math.max(this.game.arena.x + this.radius, Math.min(this.worldX, this.game.arena.x + this.game.arena.width - this.radius));
            this.worldY = Math.max(this.game.arena.y + this.radius, Math.min(this.worldY, this.game.arena.y + this.game.arena.height - this.radius));
        }
    }

    startAttack() {
        this.state = 'attack';
        this.spriteAttack.frameX = 0;
        this.attackTimer = 0;
        this.hasDealtDamage = false;
    }

    takeDamage(amount) {
        if (this.state === 'dead') return
        this.hp -= amount;
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.state = 'dead';
        this.spriteDeath.frameX = 0;

        this.game.dataManager.addGold(50);

        setTimeout(() => {
            this.game.triggerVictory();
        }, 2000);
    }

    draw(context) {
        const screenX = Math.floor((this.worldX - this.game.player.worldX) + this.game.width / 2);
        const screenY = Math.floor((this.worldY - this.game.player.worldY) + this.game.height / 2);

        if (this.state !== 'dead') {
            context.fillStyle = 'red';
            context.fillRect(screenX - 40, screenY - 60, 80, 5);
            context.fillStyle = '#00FF00';
            context.fillRect(screenX - 40, screenY - 60, 80 * (this.hp / this.maxHp), 5);
        }

        let spriteToDraw;
        if (this.state === 'dead') spriteToDraw = this.spriteDeath;
        else if (this.state === 'attack') spriteToDraw = this.spriteAttack;
        else spriteToDraw = this.spriteRun;

        spriteToDraw.draw(context, screenX, screenY, 128, 128);
    }
}