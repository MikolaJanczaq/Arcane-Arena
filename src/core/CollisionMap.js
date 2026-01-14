export class CollisionMap {
    constructor(game) {
        this.game = game;
        this.image = new Image();
        this.image.src = "assets/obstacles_map.png";

        this.isLoaded = false;
        this.data = null;
        this.width = 0;
        this.height = 0;

        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;

            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(this.image, 0, 0);

            this.data = ctx.getImageData(0, 0, this.width, this.height).data;

            this.isLoaded = true;
            console.log("Collision Map Loaded. Size: " + this.width + "x" + this.height);
        };
    }

    isObstacle(x, y) {
        if (!this.isLoaded || !this.data) return false;

        let mapX = Math.floor(x % this.width);
        let mapY = Math.floor(y % this.height);

        if (mapX < 0) mapX += this.width;
        if (mapY < 0) mapY += this.height;

        const index = (mapY * this.width + mapX) * 4;

        const r = this.data[index];
        const g = this.data[index + 1];
        const b = this.data[index + 2];

        return r < 50 && g < 50 && b < 50;
    }
}