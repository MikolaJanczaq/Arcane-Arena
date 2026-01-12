export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.lastTime = 0;
        this.isPaused = false;

        console.log("Game initiated: " + this.width + "x" + this.height + "");
    }

    update(deltaTime) {
        if (this.isPaused) return;

    }

    draw(context) {
        context.fillStyle = "#1a1a1a";
        context.fillRect(0, 0, this.width, this.height);

        context.fillStyle = 'white';
        context.fillRect(this.width / 2 - 25, this.height / 2 - 25, 50, 50);
    }

}

