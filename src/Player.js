export class Player {
    constructor(game) {
        this.game = game;
        this.worldX = 0;
        this.worldY = 0;
        this.speed = 3;
        this.radius = 20;
        this.color = 'gold'

        this.experience = 0;
        this.experienceToNextLevel = 100;
        this.gold = 0;
        this.level = 1;

        this.maxHp = 100;
        this.hp = this.maxHp;

        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.invulnerableInterval = 500;
    }

    update(input, deltatime) {
        this.worldX += input.x * this.speed;
        this.worldY += input.y * this.speed;

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
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.2)

        this.hp = this.maxHp;
        console.log("Level Up! Level: " + this.level);
        //TODO menu for selecting new weapon/selecting upgrades for weapons
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
        const screenX = this.game.width /2;
        const screenY = this.game.height / 2;

        context.save();
        context.beginPath();
        context.arc(screenX, screenY, this.radius, 0, Math.PI * 2);

        if (this.invulnerable) {
            context.globalAlpha = 0.5;
        }

        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.stroke();
        context.restore();
    }
}