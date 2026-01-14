import {InputHandler} from "./InputHandler.js";
import {Player} from "../entities/Player.js";
import {Background} from "../graphics/Background.js";
import {Enemy} from "../entities/Enemy.js";
import {Sword} from "../weapons/Sword.js";
import {Drop} from "../entities/Drop.js";
import {UI} from "../graphics/UI.js";
import {SpatialGrid} from "./SpatialGrid.js";
import {UpgradeManager} from "../systems/UpgradeManager.js";
import {Boss} from "../entities/Boss.js";

export class Game {
    constructor(width, height, dataManager) {
        this.width = width;
        this.height = height;
        this.isPaused = false;
        this.gameOver = false;

        this.level = 1;

        this.levelDuration = 180000;
        this.levelTimer = 0;
        this.bossSpawned = false;
        this.boss = null;
        this.arena = null;

        this.dataManager = dataManager;

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
        this.victoryScreen = document.getElementById('victory-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.scoreText = document.getElementById('score-text');

        this.grid = new SpatialGrid(300);

        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000;

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

        if(!this.bossSpawned) {
            this.levelTimer += deltaTime;

            if (this.enemyTimer > this.enemyInterval) {
                const isFox = Math.random() < 0.5;
                const enemyImage = isFox ? this.enemyFoxImage : this.enemyBirdImage;
                this.enemies.push(new Enemy(this, enemyImage));
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            if (this.levelTimer >= this.levelDuration) {
                this.spawnBoss();
            }
        } else {
            if (this.boss) this.boss.update(deltaTime);
        }

        if (this.arena) {
            this.player.worldX = Math.max(
                this.arena.x + this.player.radius,
                Math.min(this.player.worldX, this.arena.x + this.arena.width - this.player.radius)
            );
            this.player.worldY = Math.max(
                this.arena.y + this.player.radius,
                Math.min(this.player.worldY, this.arena.y + this.arena.height - this.player.radius)
            );
        }

        this.grid.clear();

        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
            this.grid.add(enemy);
        })
        if (this.boss && this.boss.state !== 'dead') {
            this.grid.add(this.boss);
        }

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

        if (this.arena) {
            context.save();
            const screenX = (this.arena.x - this.player.worldX) + this.width / 2;
            const screenY = (this.arena.y - this.player.worldY) + this.height / 2;

            context.strokeStyle = '#a93226';
            context.lineWidth = 10;
            context.strokeRect(screenX, screenY, this.arena.width, this.arena.height);

            context.restore();
        }

        this.drops.forEach(drop => drop.draw(context));

        this.enemies.forEach(enemy => {
            enemy.draw(context);
        });

        if (this.boss) this.boss.draw(context);

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

    spawnBoss() {
        this.bossSpawned = true;

        this.enemies = [];
        this.grid.clear();

        this.boss = new Boss(this);

        const arenaWidth = 1000;
        const arenaHeight = 800;
        this.arena = {
            x: this.player.worldX - arenaWidth / 2,
            y: this.player.worldY - arenaHeight / 2,
            width: arenaWidth,
            height: arenaHeight
        }

        console.log("Boss spawned, arena closed")
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

    triggerGameOver() {
        this.gameOver = true;
        this.dataManager.addGold(this.player.gold);
        this.gameOverScreen.classList.remove('hidden');
        this.scoreText.innerText = "Level Reached: " + this.player.level;
    }

    triggerVictory() {
        this.dataManager.addGold(this.player.gold);
        this.isPaused = true;
        this.victoryScreen.classList.remove('hidden');
    }
}

