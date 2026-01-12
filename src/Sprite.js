export class Sprite {
    constructor(game, image, frameWidth, frameHeight) {
        this.game = game;
        this.image = image;

        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;

        this.fps = 15;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    update(deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(context, x, y, width, height) {
        if (this.image && this.image.complete) {
            context.drawImage(
                this.image,
                this.frameX * this.frameWidth,
                this.frameY * this.frameHeight,
                this.frameWidth,
                this.frameHeight,
                x - width / 2,
                y - height / 2,
                width,
                height
            );
        }
    }
}