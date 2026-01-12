import {InputHandler} from "./InputHandler.js";
import {Player} from "./Player.js";
import {Background} from "./Background.js";
import {Enemy} from "./Enemy.js";
import {Sword} from "./Sword.js";
import {Drop} from "./Drop.js";
import {UI} from "./UI.js";
import {SpatialGrid} from "./SpatialGrid.js";
import {UpgradeManager} from "./UpgradeManager.js";

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
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
        this.upgradeManager = new UpgradeManager(this);

        this.levelUpScreen = document.getElementById('levelup-screen');
        this.optionsContainer = document.getElementById('options-container');

        this.grid = new SpatialGrid(300);

        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000; // ms

        this.weapons = [];
        this.weapons.push(new Sword(this));

        this.projectiles = [];

        this.drops = [];


        console.log("Game initiated: " + this.width + "x" + this.height + "");
    }

    update(deltaTime) {
        if (this.gameOver || this.isPaused) return;

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
                if (Math.random() < 0.1) {
                    this.player.applyFreeze();
                }

                this.player.takeDamage(nearbyEnemie.damage);
            }
        })

        this.weapons.forEach(weapons => {
            weapons.update(deltaTime);
        })

        this.projectiles.forEach(p => p.update(deltaTime));
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

        this.drops.forEach(drop => drop.update())
        this.drops = this.drops.filter(drop => !drop.markedForDeletion);

    }

    draw(context) {
        context.fillStyle = "#228B22";
        context.fillRect(0, 0, this.width, this.height);

        this.background.draw(context);

        this.drops.forEach(drop => drop.draw(context));

        this.enemies.forEach(enemy => {
            enemy.draw(context);
        });

        this.player.draw(context);

        this.weapons.forEach(weapon => {
            weapon.draw(context);
        })

        this.projectiles.forEach(p => p.draw(context));

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

    triggerLevelUp() {
        this.isPaused = true;
        this.levelUpScreen.classList.remove('hidden');
        this.optionsContainer.innerHTML = '';

        const options = this.upgradeManager.getOptions(3);

        options.forEach(upgrade => {
            const btn = document.createElement('div');
            btn.className = 'upgrade-btn';
            btn.innerHTML = `
                <h3>${upgrade.name}</h3>
                <p>${upgrade.desc}</p>
            `;

            btn.addEventListener('click', () => {
                this.selectUpgrade(upgrade);
            });

            this.optionsContainer.appendChild(btn);
        });
    }

    selectUpgrade(upgrade) {
        console.log("Selected upgrade: " + upgrade.name);
        upgrade.apply(this);

        this.levelUpScreen.classList.add('hidden');
        this.isPaused = false;
    }
}

