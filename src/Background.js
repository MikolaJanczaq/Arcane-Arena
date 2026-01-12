export class Background{
    constructor(game) {
        this.game = game;
        this.tileSize = 100;
    }

    draw(context) {
        const offsetX= this.game.player.worldX % this.tileSize;
        const offsetY= this.game.player.worldY % this.tileSize;

        context.save();
        context.strokeStyle = '#333';
        context.lineWidth = 1;

        // vertical lines
        for (let x = -this.tileSize; x < this.game.width + this.tileSize; x += this.tileSize) {
            const drawX = x - offsetX;

            context.beginPath();
            context.moveTo(drawX, 0);
            context.lineTo(drawX, this.game.height);
            context.stroke();
        }

        // horizontal lines
        for (let y = -this.tileSize; y < this.game.height + this.tileSize; y += this.tileSize) {
            const drawY = y - offsetY;

            context.beginPath();
            context.moveTo(0, drawY);
            context.lineTo(this.game.width, drawY);
            context.stroke();
        }

        context.restore();
    }
}