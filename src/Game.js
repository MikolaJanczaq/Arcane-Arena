import {InputHandler} from "./InputHandler.js";
import {Player} from "./Player.js";
import {Background} from "./Background.js";
import {Enemy} from "./Enemy.js";

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.lastTime = 0;
        this.isPaused = false;

        this.input = new InputHandler();
        this.player = new Player(this);
        this.background = new Background(this);

        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000; // ms

        console.log("Game initiated: " + this.width + "x" + this.height + "");
    }

    update(deltaTime) {
        this.input.update();
        this.player.update(this.input);

        if (this.enemyTimer > this.enemyInterval) {
            this.enemies.push(new Enemy(this));
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }

        this.enemies.forEach(enemy => {
            enemy.update();
        })

        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
    }

    draw(context) {
        context.fillStyle = "#228B22";
        context.fillRect(0, 0, this.width, this.height);

        this.background.draw(context);

        this.enemies.forEach(enemy => {
            enemy.draw(context);
        });

        this.player.draw(context);

        // joystick
        if(this.input.touchActive) {
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
    }

}

