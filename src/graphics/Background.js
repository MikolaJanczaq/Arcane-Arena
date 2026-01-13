export class Background {
    constructor(game) {
        this.game = game;

        this.image = new Image();
        this.image.src = "assets/background.png";
    }

    draw(context) {
        if (!this.image.complete) {
            context.fillStyle = "#3a2e25";
            context.fillRect(0, 0, this.game.width, this.game.height);
            return;
        }

        const tileWidth = this.image.width;
        const tileHeight = this.image.height;

        if (tileWidth === 0 || tileHeight === 0) return;

        const cameraX = this.game.player.worldX - this.game.width / 2;
        const cameraY = this.game.player.worldY - this.game.height / 2;

        const startCol = Math.floor(cameraX / tileWidth);
        const endCol = startCol + (this.game.width / tileWidth) + 1;

        const startRow = Math.floor(cameraY / tileHeight);
        const endRow = startRow + (this.game.height / tileHeight) + 1;

        for (let col = startCol; col <= endCol; col++) {
            for (let row = startRow; row <= endRow; row++) {

                const tileWorldX = col * tileWidth;
                const tileWorldY = row * tileHeight;

                const screenX = tileWorldX - cameraX;
                const screenY = tileWorldY - cameraY;

                context.drawImage(
                    this.image,
                    Math.floor(screenX),
                    Math.floor(screenY),
                    tileWidth + 1,
                    tileHeight + 1
                );
            }
        }
    }
}