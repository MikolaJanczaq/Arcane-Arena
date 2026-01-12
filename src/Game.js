import {InputHandler} from "./InputHandler.js";
import {Player} from "./Player.js";

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.lastTime = 0;
        this.isPaused = false;
        this.input = new InputHandler();
        this.player = new Player(this);

        console.log("Game initiated: " + this.width + "x" + this.height + "");
    }

    update(deltaTime) {
        this.input.update();
        this.player.update(this.input);
    }

    draw(context) {
        context.fillStyle = "#1a1a1a";
        context.fillRect(0, 0, this.width, this.height);

        this.player.draw(context);
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

