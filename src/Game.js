import {InputHandler} from "./InputHandler.js";
import {Player} from "./Player.js";
import {Background} from "./Background.js";
import {Enemy} from "./Enemy.js";
import {Sword} from "./Sword.js";
import {Drop} from "./Drop.js";
import {UI} from "./UI.js";
import {SpatialGrid} from "./SpatialGrid.js";

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.lastTime = 0;
        this.isPaused = false;
        this.gameOver = false;

        this.playerImage = new Image();
        this.playerImage.src = "assets/player/Swordsman_Walk.png";
        this.playerAttackImage = new Image();
        this.playerAttackImage.src = "assets/player/Swordsman_Walk_Attack.png";

        this.enemyFoxImage = new Image();
        this.enemyFoxImage.src = "assets/enemies/Fox/Fox_Run.png"

        this.enemyBirdImage = new Image();
        this.enemyBirdImage.src = "assets/enemies/Bird/Bird_Flight.png"

        this.input = new InputHandler();
        this.player = new Player(this);
        this.background = new Background(this);
        this.ui = new UI(this);

        this.grid = new SpatialGrid(300);

        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000; // ms

        this.weapons = []
        this.weapons.push(new Sword(this));

        this.drops = [];

        console.log("Game initiated: " + this.width + "x" + this.height + "");
    }

    update(deltaTime) {
        if (this.gameOver) return;

        this.input.update();
        this.player.update(this.input, deltaTime);

        if (this.enemyTimer > this.enemyInterval) {
            const isFox = Math.random() < 0.5;
            const enemyImage = isFox ? this.enemyFoxImage : this.enemyBirdImage;
            this.enemies.push(new Enemy(this, enemyImage));
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }

        this.grid.clear();

        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
            this.grid.add(enemy);
        })
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

        const nearbyEnemies = this.grid.getNearby(this.player.worldX, this.player.worldY);

        nearbyEnemies.forEach(nearbyEnemie => {
            const dx = nearbyEnemie.worldX - this.player.worldX;
            const dy = nearbyEnemie.worldY - this.player.worldY;
            const distance = Math.hypot(dx, dy);

            if (distance < nearbyEnemie.radius + this.player.radius) {
                this.player.takeDamage(nearbyEnemie.damage);
            }
        })

        this.weapons.forEach(weapons => {
            weapons.update(deltaTime);
        })

        this.drops.forEach(drop => drop.update())
        this.drops = this.drops.filter(drop => !drop.markedForDeletion);

    }

    draw(context) {
        context.fillStyle = "#228B22";
        context.fillRect(0, 0, this.width, this.height);

        this.background.draw(context);

        this.enemies.forEach(enemy => {
            enemy.draw(context);
        });

        this.player.draw(context);

        this.weapons.forEach(weapon => {
            weapon.draw(context);
        })

        this.drops.forEach(drop => drop.draw(context));

        // joystick
        if(this.input.touchActive && !this.gameOver) {
            // joystick base
            context.beginPath()
            context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            context.lineWidth = 2;
            context.arc(this.input.touchStartX, this.input.touchStartY, 50, 0, Math.PI * 2);
            context.stroke();

            //joystick knob
            context.beginPath()
            context.fillStyle = 'rgba(255, 255, 255, 0.8)';
            context.arc(this.input.touchStartX + (this.input.x * 50), this.input.touchStartY + (this.input.y * 50), 20, 0, Math.PI * 2);
            context.fill();
        }

        this.ui.draw(context);
    }
    spawnDrop(x, y) {
        const chance = Math.random();

        if (chance < 0.8) {
            this.drops.push(new Drop(this, x, y, 'xp'))
        }
        else {
            this.drops.push(new Drop(this, x, y, 'gold'))
        }
    }

}

