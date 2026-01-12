export class Player {
    constructor(game) {
        this.game = game;
        this.x = game.width * 0.5;
        this.y = game.height * 0.5;
        this.radius = 20;
        this.speed = 3;
        this.color = 'gold'
    }

    update(input) {
        this.x += input.x * this.speed;
        this.y += input.y * this.speed;

        // temporary boundaries
        if (this.x < this.radius) this.x = this.radius;
        if (this.x > this.game.width - this.radius) this.x = this.game.width - this.radius;
        if (this.y < this.radius) this.y = this.radius;
        if (this.y > this.game.height - this.radius) this.y = this.game.height - this.radius;
    }

    draw(context) {
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = 'black';
        context.stroke();
        context.restore();
    }
}