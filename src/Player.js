export class Player {
    constructor(game) {
        this.game = game;
        this.worldX = 0;
        this.worldY = 0;
        this.speed = 3;
        this.radius = 20;
        this.color = 'gold'
    }

    update(input) {
        this.worldX += input.x * this.speed;
        this.worldY += input.y * this.speed;
    }

    draw(context) {
        const screenX = this.game.width /2;
        const screenY = this.game.height / 2;

        context.save();
        context.beginPath();
        context.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.stroke();
        context.restore();
    }
}